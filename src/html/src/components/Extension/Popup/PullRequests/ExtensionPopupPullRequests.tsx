import React from 'react';
import { useTheme } from 'styled-components';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import ClipLoader from 'react-spinners/ClipLoader';
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Counter, Flex, Icon, Status, Text, Title } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';

import { getRepositoryUrl, getPullRequestUrl, getUserUrl } from 'lib/Github/GithubUrl';
import Storage from 'lib/Storage';
import GithubLabel from 'components/common/ui/GithubLabel/GithubLabel';
import { GithubTabs } from 'components/common/ui/GithubTabs';
import { useMessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { usePageHandlerContext } from 'components/Extension/Context/PageContext';
import { GithubPullRequest, GithubPullRequestChanges } from 'types/Github';

import {
	StyledExtensionPopupPullRequests,
	StyledHoveredText,
	StyledLoader,
	StyledPullRequest,
	StyledPullRequestChange,
	StyledPullRequestChangeText,
	StyledPullRequestStatusContentWrapper
} from './styled';
import { PullRequestFilter } from './types';

const __getPullRequestChangeKey = (pr: GithubPullRequest) => `${pr.owner}-${pr.repository}-${pr.number}`;

const POPUP_TAB_ID_KEY = 'popup_tab_id';

const ExtensionPopupPullRequests: React.FC = () => {
	const [selectedTab, setSelectedTab] = React.useState<PullRequestFilter>();
	const [user, setUser] = React.useState<any>();
	const [pullRequests, setPullRequests] = React.useState<GithubPullRequest[]>([]);
	const [pullRequestsChanges, setPullRequestsChanges] = React.useState<Record<string, GithubPullRequestChanges>>({});
	const [loadingPullRequests, setLoadingPullRequests] = React.useState<boolean>(false);
	const [hasReceivedPullRequests, setHasReceivedPullRequests] = React.useState<boolean>(false);

	const messageHandlers = useMessageHandlersContext()!;
	const pageHandlers = usePageHandlerContext()!;

	const theme = useTheme();

	React.useEffect(() => {
		const setupSavedTab = async () => {
			const savedSelectedTab = await Storage.get(POPUP_TAB_ID_KEY);
			setSelectedTab(savedSelectedTab ?? 'all');
		};
		setupSavedTab();

		messageHandlers.sendBackgroundMessage({ type: 'get_user' });
		messageHandlers.sendBackgroundMessage({ type: 'get_pull_requests' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'pull_requests_loading') setLoadingPullRequests(true);
			else if (message.type === 'pull_requests_updated') {
				setPullRequests(orderBy(message.data.pullRequests, 'updated_at', 'desc'));
				setHasReceivedPullRequests(true);
				setPullRequestsChanges(message.data.changes);
				setLoadingPullRequests(false);
			} else if (message.type === 'pull_request_changes') {
				setPullRequestsChanges(message.data);
			} else if (message.type === 'user_updated') setUser(message.data);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const loaderContent = React.useMemo(
		() => (
			<StyledLoader duration="0.25s" isVisible={loadingPullRequests} title="Updating pull requests">
				<ClipLoader size={16} color="#fff" speedMultiplier={0.75} />
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
									<Icon.FontAwesome icon={solid('code-commit')} size={12} />
									<StyledPullRequestChangeText>{prChanges.commits}</StyledPullRequestChangeText>
								</StyledPullRequestChange>
							)}
							{!!prChanges.comments && (
								<StyledPullRequestChange title="New comments">
									<Icon.FontAwesome icon={solid('message')} size={9} />
									<StyledPullRequestChangeText>{prChanges.comments}</StyledPullRequestChangeText>
								</StyledPullRequestChange>
							)}
							{!!prChanges.reviews && (
								<StyledPullRequestChange title="Reviews updated">
									<Icon.FontAwesome icon={solid('list-check')} size={12} />
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
			if (pullRequest.checks.failed > 0) content = <Icon.FontAwesome color="red.600" icon={solid('times')} size={14} />;
			else if (pullRequest.checks.pending > 0) content = <Status size={10} variant="yellow" />;
			else content = <Icon.FontAwesome color="green.600" icon={solid('check')} size={14} />;
		}

		return (
			<Flex alignItems="center" size={16}>
				{content}
			</Flex>
		);
	}, []);

	const onChangeTab = React.useCallback((tabId: PullRequestFilter) => {
		Storage.set(POPUP_TAB_ID_KEY, tabId);
		setSelectedTab(tabId);
	}, []);

	const filteredGithubPullRequests = React.useMemo(() => {
		return pullRequests.reduce(
			(prev: Record<PullRequestFilter, GithubPullRequest[]>, pr: GithubPullRequest) => {
				if (true) prev.all.push(pr); // TODO! filter hidden
				if (pr.user.username === user?.login) prev.mine.push(pr);
				if (false) prev.favorites.push(pr); // TODO! filter favorites
				if (false) prev.hidden.push(pr); // TODO! filter hidden

				return prev;
			},
			{ all: [], mine: [], favorites: [], hidden: [] }
		);
	}, [pullRequests, user?.login]);

	const tabsContent = React.useMemo(() => {
		if (!selectedTab || !hasReceivedPullRequests) return null;

		return (
			<GithubTabs defaultTab={selectedTab} onChangeTab={onChangeTab as (id: string) => void}>
				<GithubTabs.Tab id="all">
					<Icon.FontAwesome aspectSize="xs" icon={solid('code-pull-request')} />
					<GithubTabs.Text>All pull requests</GithubTabs.Text>
					{filteredGithubPullRequests.all.length > 0 && (
						<Counter aspectSize="s" numberOfItems={filteredGithubPullRequests.all.length} />
					)}
				</GithubTabs.Tab>
				<GithubTabs.Tab id="mine">
					<Icon.FontAwesome aspectSize="s" icon={regular('circle-user')} />
					<GithubTabs.Text>Created by me</GithubTabs.Text>
					{filteredGithubPullRequests.mine.length > 0 && (
						<Counter aspectSize="s" numberOfItems={filteredGithubPullRequests.mine.length} />
					)}
				</GithubTabs.Tab>
				<GithubTabs.Tab id="favorites">
					<Icon.FontAwesome aspectSize="s" icon={regular('star')} />
					<GithubTabs.Text>Favorites</GithubTabs.Text>
					{filteredGithubPullRequests.favorites.length > 0 && (
						<Counter aspectSize="s" numberOfItems={filteredGithubPullRequests.favorites.length} />
					)}
				</GithubTabs.Tab>
				<GithubTabs.Tab id="hidden">
					<Icon.FontAwesome aspectSize="s" icon={regular('eye-slash')} />
					<GithubTabs.Text>Hidden</GithubTabs.Text>
					{filteredGithubPullRequests.hidden.length > 0 && (
						<Counter aspectSize="s" numberOfItems={filteredGithubPullRequests.hidden.length} />
					)}
				</GithubTabs.Tab>
			</GithubTabs>
		);
	}, [filteredGithubPullRequests, hasReceivedPullRequests, onChangeTab, selectedTab]);

	const content = React.useMemo(() => {
		let finalPullRequests: GithubPullRequest[];
		switch (selectedTab) {
			case 'all':
				finalPullRequests = filteredGithubPullRequests.all;
				break;
			case 'mine':
				finalPullRequests = filteredGithubPullRequests.mine;
				break;
			case 'favorites':
				finalPullRequests = filteredGithubPullRequests.favorites;
				break;
			case 'hidden':
				finalPullRequests = filteredGithubPullRequests.hidden;
				break;
			default:
				finalPullRequests = [];
				break;
		}

		if (!hasReceivedPullRequests) return null;

		if (!finalPullRequests.length)
			return (
				<Flex alignItems="center" flexDirection="column" height="100%" justifyContent="center" rowGap={2}>
					<Icon.FontAwesome
						aspectSize="l"
						icon={regular('face-frown')}
						bounce
						style={{ '--fa-animation-iteration-count': 2 } as any}
					/>
					<Title aspectSize="xs">Oups! No pull requests have been found.</Title>
				</Flex>
			);

		return finalPullRequests.map(pr => {
			const repoUrl = getRepositoryUrl(pr.owner, pr.repository);
			const prUrl = getPullRequestUrl(pr.owner, pr.repository, pr.number);
			const userUrl = getUserUrl(pr.user.username);
			return (
				<StyledPullRequest key={pr.repository + pr.number}>
					<Flex flexShrink={0} marginX={2}>
						<Icon.FontAwesome color="primary.500" icon={solid('code-pull-request')} size={14} />
					</Flex>
					<Flex flexDirection="column" mr={5}>
						<Flex>
							<StyledHoveredText
								aspectSize="xs"
								color={getColorByMode(theme, { light: 'neutral.400', dark: 'neutral.300' })}
								href={repoUrl}
								onClick={() => pageHandlers.openNewTab(repoUrl)}
							>
								{pr.owner}/{pr.repository}
							</StyledHoveredText>
						</Flex>
						<Flex alignItems="center" flexWrap="wrap">
							<StyledHoveredText href={prUrl} onClick={() => pageHandlers.openNewTab(prUrl)}>
								{pr.title}
							</StyledHoveredText>
							<StyledPullRequestStatusContentWrapper>
								{getPullRequestStatusContent(pr)}
							</StyledPullRequestStatusContentWrapper>
							{pr.labels.map(label => (
								<GithubLabel key={label.id} color={`#${label.color}`} text={label.name} />
							))}
						</Flex>
						<Text aspectSize="xs" color={getColorByMode(theme, { light: 'neutral.500', dark: 'neutral.400' })}>
							#{pr.number} opened by{' '}
							<StyledHoveredText
								aspectSize="xs"
								color={getColorByMode(theme, { light: 'neutral.600', dark: 'neutral.300' })}
								href={userUrl}
								onClick={() => pageHandlers.openNewTab(userUrl)}
							>
								{pr.user.username}
							</StyledHoveredText>{' '}
							- Updated {moment(pr.updated_at).fromNow()}
						</Text>
					</Flex>
					{getPullRequestChangesContent(pr)}
				</StyledPullRequest>
			);
		});
	}, [
		filteredGithubPullRequests,
		getPullRequestChangesContent,
		getPullRequestStatusContent,
		hasReceivedPullRequests,
		pageHandlers,
		selectedTab,
		theme
	]);

	return (
		<Flex flexDirection="column" height="calc(100% - 50px)">
			{tabsContent}
			<StyledExtensionPopupPullRequests id="githubExtensionPopupPullRequests">
				{loaderContent}
				{content}
			</StyledExtensionPopupPullRequests>
		</Flex>
	);
};

export default React.memo(ExtensionPopupPullRequests);
