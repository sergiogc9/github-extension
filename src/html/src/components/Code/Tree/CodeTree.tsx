import React from 'react';
import { useAsync } from 'react-async';
import keys from 'lodash/keys';
import isEmpty from 'lodash/isEmpty';

import { StyledTree, TreeSkeleton } from 'components/common/ui/Tree';
import { usePageContext } from 'components/Extension/Context/PageContext';
import { useSearchContext } from 'components/Extension/Context/SearchContext';
import { useStorageContext } from 'components/Extension/Context/StorageContext';
import CodeTreeFolder from 'components/Code/Folder/CodeTreeFolder';
import CodeTreeFile from 'components/Code/File/CodeTreeFile';
import GithubApi from 'lib/Github/GithubApi';
import { useOnGithubApiError } from 'lib/hooks/useOnGithubApiError';
import { CodeTree as CodeTreeType } from 'lib/Github/GithubTree';

import CodeTreeSearch from './Search/CodeTreeSearch';

const CodeTree: React.FC = () => {
	const pageData = usePageContext()!;
	const storageData = useStorageContext()!;
	const { searchValue } = useSearchContext();

	const { onGithubApiError } = useOnGithubApiError();

	const { data: codeTree, isLoading } = useAsync({
		promiseFn: GithubApi.getCodeTree,
		data: pageData.data,
		onReject: onGithubApiError
	});

	const [treeData, setTreeData] = React.useState<CodeTreeType | null>(null);
	const [foldersToLoad, setFoldersToLoad] = React.useState<{ path: string; sha: string }[]>([]);

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
			const folderApiData = await GithubApi.getFolderTreeData(
				pageData.data.user,
				pageData.data.repository,
				nextFolder.sha
			);
			codeTree.loadFolder(folderApiData, nextFolder.path);
			setTreeData(codeTree.getTree());
		})();
	}, [foldersToLoad]); // eslint-disable-line react-hooks/exhaustive-deps

	const onLoadSubTree = React.useCallback((path: string, sha: string) => {
		setFoldersToLoad(currentFoldersToLoad => [...currentFoldersToLoad, { path, sha }]);
	}, []);

	const treeContent = React.useMemo(() => {
		if (isLoading || !treeData) return <TreeSkeleton />;

		return (
			<>
				{keys(treeData.folders).map(folderName => (
					<CodeTreeFolder
						key={folderName}
						folder={treeData.folders[folderName]}
						deep={0}
						onLoadFolder={onLoadSubTree}
					/>
				))}
				{keys(treeData.files).map(fileName => (
					<CodeTreeFile key={fileName} file={treeData.files[fileName]} deep={0} isFolderVisible={false} />
				))}
			</>
		);
	}, [treeData, onLoadSubTree, isLoading]);

	return (
		<>
			<CodeTreeSearch />
			<StyledTree>{treeContent}</StyledTree>
		</>
	);
};

export default React.memo(CodeTree);
