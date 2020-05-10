import React from 'react';
import { useAsync } from 'react-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import GithubApi from '../../lib/Github/GithubApi';
import { PageContext } from '../Extension/Context/PageContext';
import PullRequestTree from './Tree/PullRequestTree';

import './PullRequest.scss';

const PullRequest: React.FC = props => {
	const pageData = React.useContext(PageContext)!;
	const { data: pullRequest, error, isLoading } = useAsync({ promiseFn: GithubApi.getPullRequestInfo, data: pageData.data });

	const headerContent = React.useMemo(() => {
		const { user, repository } = pageData.data;
		return <div id='githubExtensionPullRequestHeader' className='github-extension-header'>
			<FontAwesomeIcon icon={['far', 'code-merge']} />
			<div id="githubExtensionPullRequestHeaderInfo" className='github-extension-header-info'>
				<div id='githubExtensionPullRequestHeaderTitle' className='github-extension-header-info-title'>
					<a href={`https://github.com/${user}`} target='_blank'>{user}</a>
					<FontAwesomeIcon icon={['fas', 'chevron-double-right']} />
					<a href={`https://github.com/${user}/${repository}`} target='_blank'>{repository}</a>
				</div>
				<div id='githubExtensionPullRequestHeaderBranch' className='github-extension-header-branch'>
					{
						pullRequest &&
						<>
							<span>{pullRequest.branches.base}</span>
							<FontAwesomeIcon icon={['fas', 'angle-left']} />
							<span>{pullRequest.branches.head}</span>
						</>
					}
				</div>
			</div>
		</div>;
	}, [pageData.data, pullRequest]);

	return (
		<div id="githubExtensionPullRequest" className='github-extension'>
			{headerContent}
			{pullRequest && pullRequest.state}
			<PullRequestTree />
		</div>
	);
};

export default React.memo(PullRequest);
