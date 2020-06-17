import React from 'react';

import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { SymbolicIcon } from 'components/common/Icon/Icon';
import { GithubPullRequest } from 'types/Github';
import { PageHandlerContext } from 'components/Extension/Context/PageContext';
import { getRepositoryUrl, getPullRequestUrl, getUserUrl } from 'lib/Github/GithubUrl';

import './ExtensionPopupPullRequests.scss';

type ComponentProps = {}

const ExtensionPopupPullRequests: React.FC<ComponentProps> = props => {
	const [pullRequests, setPullRequests] = React.useState<GithubPullRequest[]>([]);

	const messageHandlers = React.useContext(MessageHandlersContext)!;
	const pageHandlers = React.useContext(PageHandlerContext)!;

	React.useEffect(() => {
		messageHandlers.sendBackgroundMessage({ type: 'get_pull_requests' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'pull_requests_updated') setPullRequests(message.data);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const content = React.useMemo(() => pullRequests.map(pr => {
		const repoUrl = getRepositoryUrl(pr.owner, pr.repository);
		const prUrl = getPullRequestUrl(pr.owner, pr.repository, pr.number);
		const userUrl = getUserUrl(pr.user.username);
		return (
			<div className='pull-request' key={pr.repository + pr.number}>
				<SymbolicIcon name='pull-request' type='duo' color='green' />
				<div className='pr-content'>
					<a href={repoUrl} onClick={() => pageHandlers.openNewTab(repoUrl)}>{pr.owner}/{pr.repository}</a>
					<a href={prUrl} onClick={() => pageHandlers.openNewTab(prUrl)}>{pr.title}</a>
					<div className='pr-content-info'>#{pr.number} opened by <a href={userUrl} onClick={() => pageHandlers.openNewTab(userUrl)}>{pr.user.username}</a></div>
				</div>
			</div>
		);
	}), [pullRequests, pageHandlers]);

	return (
		<div id="githubExtensionPopupPullRequests">
			{content}
		</div>
	);
};

export default React.memo(ExtensionPopupPullRequests);
