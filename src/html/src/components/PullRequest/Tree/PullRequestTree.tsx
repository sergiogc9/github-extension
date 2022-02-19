import React from 'react';
import { useAsync } from 'react-async';
import keys from 'lodash/keys';

import GithubApi from 'lib/Github/GithubApi';
import { PageContext } from 'components/Extension/Context/PageContext';
import { AlertContext } from 'components/Extension/Context/AlertContext';
import { SearchContext } from 'components/Extension/Context/SearchContext';
import { StorageContext } from 'components/Extension/Context/StorageContext';
import PullRequestFolder from 'components/PullRequest/Folder/PullRequestFolder';
import PullRequestFile from 'components/PullRequest/File/PullRequestFile';
import { TreePlaceHolder } from 'components/common/Placeholder';

import './PullRequestTree.scss';

const PullRequestTree: React.FC = () => {
	const pageData = React.useContext(PageContext)!;
	const storageData = React.useContext(StorageContext)!;
	const searchValue = React.useContext(SearchContext);
	const alertHandlers = React.useContext(AlertContext)!;

	const { data: prTree, isLoading } = useAsync({
		promiseFn: GithubApi.getPullRequestFiles,
		data: pageData.data,
		onReject: alertHandlers.onGithubApiError
	});

	const treeData = React.useMemo(() => {
		if (!prTree) return null;

		if (storageData.group_folders) prTree.joinEmptyDirectories();
		prTree.filter(searchValue);

		return prTree.getTree();
	}, [prTree, searchValue, storageData.group_folders]);

	const treeContent = React.useMemo(() => {
		if (isLoading || !treeData) return <TreePlaceHolder />;

		return (
			<>
				{keys(treeData.folders).map(folderName => (
					<PullRequestFolder key={folderName} folder={treeData.folders[folderName]} deep={0} />
				))}
				{keys(treeData.files).map(fileName => (
					<PullRequestFile key={fileName} file={treeData.files[fileName]} deep={0} isFolderVisible={false} />
				))}
			</>
		);
	}, [treeData, isLoading]);

	return (
		<div id="githubExtensionPullRequestTree" className="github-extension-tree">
			{treeContent}
		</div>
	);
};

export default React.memo(PullRequestTree);
