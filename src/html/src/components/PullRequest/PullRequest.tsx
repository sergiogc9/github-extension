import React from 'react';
import { useAsync } from 'react-async';

import GithubApi from 'lib/Github/GithubApi';
import { PageContext } from 'components/Extension/Context/PageContext';
import PullRequestTree from './Tree/PullRequestTree';
import { HeaderBranchPlaceholder } from 'components/common/Placeholder';
import { FontAwesomeIcon, SymbolicIcon } from 'components/common/Icon/Icon';

import './PullRequest.scss';

const PullRequest: React.FC = props => {
	const pageData = React.useContext(PageContext)!;
	const { data: pullRequest, error, isLoading } = useAsync({ promiseFn: GithubApi.getPullRequestInfo, data: pageData.data });

	const branchContent = React.useMemo(() => {
		if (isLoading) return <HeaderBranchPlaceholder />;
		if (!pullRequest) return null;

		return (
			<>
				<span>{pullRequest.branches!.base}</span>
				<FontAwesomeIcon name='caret-up' type='solid' />
				<span>{pullRequest.branches!.head}</span>
			</>
		);
	}, [pullRequest, isLoading]);

	const headerContent = React.useMemo(() => {
		const { user, repository } = pageData.data;
		return <div id='githubExtensionPullRequestHeader' className='github-extension-header'>
			<div id='githubExtensionPullRequestHeaderTitle' className='github-extension-header-info-title'>
				<SymbolicIcon name='pull-request' type='duo' />
				<a href={`https://github.com/${user}`} target='_blank'>{user}</a>
				<FontAwesomeIcon name='chevron-double-right' type='solid' />
				<a href={`https://github.com/${user}/${repository}`} target='_blank' className='bold'>{repository}</a>
			</div>
			<div id='githubExtensionPullRequestHeaderBranch' className='github-extension-header-branch'>
				{branchContent}
			</div>
		</div>;
	}, [pageData.data, branchContent]);

	return (
		<div id="githubExtensionPullRequest" className='github-extension'>
			{headerContent}
			{pullRequest && pullRequest.state}
			<PullRequestTree />
		</div>
	);
};

export default React.memo(PullRequest);
