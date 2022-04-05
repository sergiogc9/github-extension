import React from 'react';
import { useTheme } from 'styled-components';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import HashLoader from 'react-spinners/HashLoader';
import { Content, Flex, Status } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';

import { getRepositoryUrl, getPullRequestUrl, getUserUrl } from 'lib/Github/GithubUrl';
import { SymbolicIcon, FontAwesomeIcon, MaterialUIIcon } from 'components/common/Icon/Icon';
import GithubLabel from 'components/common/ui/GithubLabel/GithubLabel';
import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { PageHandlerContext } from 'components/Extension/Context/PageContext';
import { GithubPullRequest, GithubPullRequestChanges } from 'types/Github';

import {
	StyledExtensionPopupPullRequests,
	StyledHoveredContent,
	StyledLoader,
	StyledPullRequest,
	StyledPullRequestChange,
	StyledPullRequestChangeText,
	StyledPullRequestStatusContentWrapper
} from './styled';

const __getPullRequestChangeKey = (pr: GithubPullRequest) => `${pr.owner}-${pr.repository}-${pr.number}`;

const ExtensionPopupPullRequests: React.FC = () => {
	const [pullRequests, setPullRequests] = React.useState<GithubPullRequest[]>([]);
	const [pullRequestsChanges, setPullRequestsChanges] = React.useState<Record<string, GithubPullRequestChanges>>({});
	const [loadingPullRequests, setLoadingPullRequests] = React.useState<boolean>(false);

	const messageHandlers = React.useContext(MessageHandlersContext)!;
	const pageHandlers = React.useContext(PageHandlerContext)!;

	const theme = useTheme();

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
			<StyledLoader duration="0.25s" isVisible={loadingPullRequests} title="Updating pull requests">
				<HashLoader size={16} color="#fff" />
			</StyledLoader>
		),
		[loadingPullRequests]
	);

	const getPullRequestChangesContent = React.useCallback(
		(pullRequest: GithubPullRequest) => {
			const prChanges = pullRequestsChanges && pullRequestsChanges[__getPullRequestChangeKey(pullRequest)];
			return (
				<Flex alignItems="center" flexShrink={0} ml="auto" mr={2}>
					{prChanges && (
						<>
							{!!prChanges.commits && (
								<StyledPullRequestChange title="New commits">
									<FontAwesomeIcon name="code-commit" type="duo" />
									<StyledPullRequestChangeText>{prChanges.commits}</StyledPullRequestChangeText>
								</StyledPullRequestChange>
							)}
							{!!prChanges.comments && (
								<StyledPullRequestChange title="New comments">
									<SymbolicIcon name="chat-conversation-alt" type="solid" />
									<StyledPullRequestChangeText>{prChanges.comments}</StyledPullRequestChangeText>
								</StyledPullRequestChange>
							)}
							{!!prChanges.reviews && (
								<StyledPullRequestChange title="Reviews updated">
									<SymbolicIcon name="clipboard-check" type="solid" />
									<StyledPullRequestChangeText>{prChanges.reviews}</StyledPullRequestChangeText>
								</StyledPullRequestChange>
							)}
						</>
					)}
				</Flex>
			);
		},
		[pullRequestsChanges]
	);

	const getPullRequestStatusContent = React.useCallback((pullRequest: GithubPullRequest) => {
		let content: JSX.Element | null = null;

		if (pullRequest.checks) {
			if (pullRequest.checks.failed > 0) content = <FontAwesomeIcon name="times" type="light" />;
			else if (pullRequest.checks.pending > 0) content = <Status size={10} variant="yellow" />;
			else content = <MaterialUIIcon name="check" />;
		}

		return (
			<Flex alignItems="center" size={16}>
				{content}
			</Flex>
		);
	}, []);

	const content = React.useMemo(
		() =>
			pullRequests.map(pr => {
				const repoUrl = getRepositoryUrl(pr.owner, pr.repository);
				const prUrl = getPullRequestUrl(pr.owner, pr.repository, pr.number);
				const userUrl = getUserUrl(pr.user.username);
				return (
					<StyledPullRequest key={pr.repository + pr.number}>
						<Flex flexShrink={0} marginX={2} width={15}>
							<SymbolicIcon name="pull-request" type="duo" color="green" />
						</Flex>
						<Flex flexDirection="column" mr={5}>
							<Flex>
								<StyledHoveredContent
									aspectSize="xs"
									color={getColorByMode(theme, { light: 'neutral.400', dark: 'neutral.300' })}
									href={repoUrl}
									onClick={() => pageHandlers.openNewTab(repoUrl)}
								>
									{pr.owner}/{pr.repository}
								</StyledHoveredContent>
							</Flex>
							<Flex alignItems="center" flexWrap="wrap">
								<StyledHoveredContent href={prUrl} onClick={() => pageHandlers.openNewTab(prUrl)}>
									{pr.title}
								</StyledHoveredContent>
								<StyledPullRequestStatusContentWrapper>
									{getPullRequestStatusContent(pr)}
								</StyledPullRequestStatusContentWrapper>
								{pr.labels.map(label => (
									<GithubLabel key={label.id} color={`#${label.color}`} text={label.name} />
								))}
							</Flex>
							<Content aspectSize="xs" color={getColorByMode(theme, { light: 'neutral.500', dark: 'neutral.400' })}>
								#{pr.number} opened by{' '}
								<StyledHoveredContent
									aspectSize="xs"
									color={getColorByMode(theme, { light: 'neutral.600', dark: 'neutral.300' })}
									href={userUrl}
									onClick={() => pageHandlers.openNewTab(userUrl)}
								>
									{pr.user.username}
								</StyledHoveredContent>{' '}
								- Updated {moment(pr.updated_at).fromNow()}
							</Content>
						</Flex>
						{getPullRequestChangesContent(pr)}
					</StyledPullRequest>
				);
			}),
		[getPullRequestChangesContent, getPullRequestStatusContent, pageHandlers, pullRequests, theme]
	);

	return (
		<StyledExtensionPopupPullRequests id="githubExtensionPopupPullRequests">
			{loaderContent}
			{content}
		</StyledExtensionPopupPullRequests>
	);
};

export default React.memo(ExtensionPopupPullRequests);
