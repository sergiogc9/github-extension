import React from 'react';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import HashLoader from 'react-spinners/HashLoader';
import Fade from '@material-ui/core/Fade';

import { getRepositoryUrl, getPullRequestUrl, getUserUrl } from 'lib/Github/GithubUrl';
import { SymbolicIcon, FontAwesomeIcon, MaterialUIIcon } from 'components/common/Icon/Icon';
import GithubLabel from 'components/common/ui/GithubLabel/GithubLabel';
import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { PageHandlerContext } from 'components/Extension/Context/PageContext';
import { GithubPullRequest, GithubPullRequestChanges } from 'types/Github';

import './ExtensionPopupPullRequests.scss';

const __getPullRequestChangeKey = (pr: GithubPullRequest) => `${pr.owner}-${pr.repository}-${pr.number}`;

const ExtensionPopupPullRequests: React.FC = () => {
	const [pullRequests, setPullRequests] = React.useState<GithubPullRequest[]>([]);
	const [pullRequestsChanges, setPullRequestsChanges] = React.useState<Record<string, GithubPullRequestChanges>>({});
	const [loadingPullRequests, setLoadingPullRequests] = React.useState<boolean>(false);

	const messageHandlers = React.useContext(MessageHandlersContext)!;
	const pageHandlers = React.useContext(PageHandlerContext)!;

	React.useEffect(() => {
		messageHandlers.sendBackgroundMessage({ type: 'get_pull_requests' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'pull_requests_loading') setLoadingPullRequests(true);
			else if (message.type === 'pull_requests_updated') {
				setPullRequests(orderBy(message.data.pullRequests, 'updated_at', 'desc'));
				setPullRequestsChanges(message.data.changes);
				setLoadingPullRequests(false);
			} else if (message.type === 'pull_request_changes') {
				setPullRequestsChanges(message.data);
			}
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const loaderContent = React.useMemo(
		() => (
			<Fade in={loadingPullRequests}>
				<div className="pull-request-loader" title="Updating pull requests">
					<HashLoader size={16} color="#fff" />
				</div>
			</Fade>
		),
		[loadingPullRequests]
	);

	const getPullRequestChangesContent = React.useCallback(
		(pullRequest: GithubPullRequest) => {
			const prChanges = pullRequestsChanges && pullRequestsChanges[__getPullRequestChangeKey(pullRequest)];
			return (
				<div className="pr-changes-content">
					{prChanges && (
						<>
							{!!prChanges.commits && (
								<div title="New commits">
									<FontAwesomeIcon name="code-commit" type="duo" />
									<span>{prChanges.commits}</span>
								</div>
							)}
							{!!prChanges.comments && (
								<div title="New comments">
									<SymbolicIcon name="chat-conversation-alt" type="solid" />
									<span>{prChanges.comments}</span>
								</div>
							)}
							{!!prChanges.reviews && (
								<div title="Reviews updated">
									<SymbolicIcon name="clipboard-check" type="solid" />
									<span>{prChanges.reviews}</span>
								</div>
							)}
						</>
					)}
				</div>
			);
		},
		[pullRequestsChanges]
	);

	const getPullRequestStatusContent = React.useCallback((pullRequest: GithubPullRequest) => {
		if (!pullRequest.checks) return null;

		if (pullRequest.checks.failed > 0) return <FontAwesomeIcon name="times" type="light" />;
		if (pullRequest.checks.pending > 0) return <div className="pending-circle" />;
		return <MaterialUIIcon name="check" />;
	}, []);

	const content = React.useMemo(
		() =>
			pullRequests.map(pr => {
				const repoUrl = getRepositoryUrl(pr.owner, pr.repository);
				const prUrl = getPullRequestUrl(pr.owner, pr.repository, pr.number);
				const userUrl = getUserUrl(pr.user.username);
				return (
					<div className="pull-request" key={pr.repository + pr.number}>
						<SymbolicIcon name="pull-request" type="duo" color="green" />
						<div className="pr-content">
							<a href={repoUrl} onClick={() => pageHandlers.openNewTab(repoUrl)}>
								{pr.owner}/{pr.repository}
							</a>
							<div className="title-content">
								<a href={prUrl} onClick={() => pageHandlers.openNewTab(prUrl)}>
									{pr.title}
								</a>
								{getPullRequestStatusContent(pr)}
								{pr.labels.map(label => (
									<GithubLabel key={label.id} color={`#${label.color}`} text={label.name} />
								))}
							</div>
							<div className="pr-content-info">
								#{pr.number} opened by{' '}
								<a href={userUrl} onClick={() => pageHandlers.openNewTab(userUrl)}>
									{pr.user.username}
								</a>{' '}
								- Updated {moment(pr.updated_at).fromNow()}
							</div>
						</div>
						{getPullRequestChangesContent(pr)}
					</div>
				);
			}),
		[pullRequests, pageHandlers, getPullRequestStatusContent, getPullRequestChangesContent]
	);

	return (
		<div id="githubExtensionPopupPullRequests">
			{loaderContent}
			{content}
		</div>
	);
};

export default React.memo(ExtensionPopupPullRequests);
