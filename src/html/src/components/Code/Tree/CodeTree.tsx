import React from 'react';
import { useAsync } from 'react-async';
import keys from 'lodash/keys';
import isEmpty from 'lodash/isEmpty';

import GithubApi from 'lib/Github/GithubApi';
import { PageContext } from 'components/Extension/Context/PageContext';
import { AlertContext } from 'components/Extension/Context/AlertContext';
import { SearchContext } from 'components/Extension/Context/SearchContext';
import { StorageContext } from 'components/Extension/Context/StorageContext';
import CodeTreeFolder from 'components/Code/Folder/CodeTreeFolder';
import CodeTreeFile from 'components/Code/File/CodeTreeFile';
import { CodeTree as CodeTreeType } from 'lib/Github/GithubTree';
import { TreePlaceHolder } from 'components/common/Placeholder';

import './CodeTree.scss';

const CodeTree: React.FC = props => {
	const pageData = React.useContext(PageContext)!;
	const storageData = React.useContext(StorageContext)!;
	const searchValue = React.useContext(SearchContext);
	const alertHandlers = React.useContext(AlertContext)!;

	const { data: codeTree, isLoading } = useAsync({ promiseFn: GithubApi.getCodeTree, data: pageData.data, onReject: alertHandlers.onGithubApiError });

	const [treeData, setTreeData] = React.useState<CodeTreeType | null>(null);
	const [foldersToLoad, setFoldersToLoad] = React.useState<{ path: string, sha: string }[]>([]);

	React.useEffect(() => {
		if (!codeTree) return setTreeData(null);

		if (storageData.group_folders) codeTree.joinEmptyDirectories();
		codeTree.filter(searchValue);

		setTreeData(codeTree.getTree());
	}, [codeTree, searchValue, storageData.group_folders]);

	React.useEffect(() => {
		if (isEmpty(foldersToLoad) || !codeTree) return;

		(async () => {
			const loadFolders = [...foldersToLoad];
			const nextFolder = loadFolders.shift()!;
			setFoldersToLoad(loadFolders);
			await codeTree.loadFolder(pageData.data, nextFolder.path, nextFolder.sha);
			setTreeData(codeTree.getTree());
		})();
	}, [foldersToLoad]); // eslint-disable-line react-hooks/exhaustive-deps

	const onLoadSubTree = React.useCallback((path: string, sha: string) => {
		setFoldersToLoad(foldersToLoad => [...foldersToLoad, { path, sha }]);
	}, []);

	const treeContent = React.useMemo(() => {
		if (isLoading || !treeData) return <TreePlaceHolder />;

		return (
			<>
				{keys(treeData.folders).map(folderName => <CodeTreeFolder key={folderName} folder={treeData.folders[folderName]} deep={0} onLoadFolder={onLoadSubTree} />)}
				{keys(treeData.files).map(fileName => <CodeTreeFile key={fileName} file={treeData.files[fileName]} deep={0} isFolderVisible={false} />)}
			</>
		);
	}, [treeData, onLoadSubTree, isLoading]);

	return (
		<div id="githubExtensionCodeTree" className='github-extension-tree'>
			{treeContent}
		</div>
	);
};

export default React.memo(CodeTree);
