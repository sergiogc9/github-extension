import React from 'react';
import { useAsync } from 'react-async';
import keys from 'lodash/keys';

import { StyledTree, TreeSkeleton } from 'components/common/ui/Tree';
import { PageContext } from 'components/Extension/Context/PageContext';
import { SearchContext } from 'components/Extension/Context/SearchContext';
import { StorageContext } from 'components/Extension/Context/StorageContext';
import PullRequestFolder from 'components/PullRequest/Folder/PullRequestFolder';
import PullRequestFile from 'components/PullRequest/File/PullRequestFile';
import GithubApi from 'lib/Github/GithubApi';
import { useOnGithubApiError } from 'lib/hooks/useOnGithubApiError';

const PullRequestTree: React.FC = () => {
	const pageData = React.useContext(PageContext)!;
	const storageData = React.useContext(StorageContext)!;
	const searchValue = React.useContext(SearchContext);

	const { onGithubApiError } = useOnGithubApiError();

	const { data: prTree, isLoading } = useAsync({
		promiseFn: GithubApi.getPullRequestFiles,
		data: pageData.data,
		onReject: onGithubApiError
	});

	const treeData = React.useMemo(() => {
		if (!prTree) return null;

		if (storageData.group_folders) prTree.joinEmptyDirectories();
		prTree.filter(searchValue);

		return prTree.getTree();
	}, [prTree, searchValue, storageData.group_folders]);

	const treeContent = React.useMemo(() => {
		if (isLoading || !treeData) return <TreeSkeleton />;

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

	return <StyledTree isPullRequest>{treeContent}</StyledTree>;
};

export default React.memo(PullRequestTree);
