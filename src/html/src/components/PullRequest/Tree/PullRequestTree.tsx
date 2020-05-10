import React from 'react';
import { useAsync } from 'react-async';
import keys from 'lodash/keys';

import GithubApi from '../../../lib/Github/GithubApi';
import { PageContext } from '../../Extension/Context/PageContext';
import { SearchContext } from '../../Extension/Context/SearchContext';
import { StorageContext } from '../../Extension/Context/StorageContext';
import PullRequestFolder from '../Folder/PullRequestFolder';
import PullRequestFile from '../File/PullRequestFile';

import './PullRequestTree.scss';

const PullRequestTree: React.FC = props => {
	const pageData = React.useContext(PageContext)!;
	const storageData = React.useContext(StorageContext)!;
	const searchValue = React.useContext(SearchContext);
	const { data: prTree, error, isLoading } = useAsync({ promiseFn: GithubApi.getPullRequestFiles, data: pageData.data });

	const treeData = React.useMemo(() => {
		if (!prTree) return null;

		if (storageData.group_folders) prTree.joinEmptyDirectories();
		prTree.filter(searchValue);

		return prTree.getTree();
	}, [prTree, searchValue, storageData.group_folders]);

	const treeContent = React.useMemo(() => {
		if (!treeData) return null;

		return (
			<>
				{keys(treeData.folders).map(folderName => <PullRequestFolder key={folderName} folder={treeData.folders[folderName]} deep={0} />)}
				{keys(treeData.files).map(fileName => <PullRequestFile key={fileName} file={treeData.files[fileName]} deep={0} isFolderVisible={false} />)}
			</>
		);
	}, [treeData]);

	return (
		<div id="githubExtensionPullRequestTree" className='github-extension-tree'>
			{treeContent}
		</div>
	);
};

export default React.memo(PullRequestTree);
