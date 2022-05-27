import React from 'react';
import { useTheme } from 'styled-components';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import ClipLoader from 'react-spinners/ClipLoader';
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Counter, Flex, Icon, Status, Text } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';

import { getRepositoryUrl, getPullRequestUrl, getUserUrl } from 'lib/Github/GithubUrl';
import GithubLabel from 'components/common/ui/GithubLabel/GithubLabel';
import { GithubTabs } from 'components/common/ui/GithubTabs';
import { useMessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { usePageHandlerContext } from 'components/Extension/Context/PageContext';
import {
	POPUP_TAB_ID_KEY,
	POPUP_STARRED_PULL_REQUESTS_KEY,
	useStorageContext,
	useStorageHandlerContext,
	POPUP_HIDDEN_PULL_REQUESTS_KEY
} from 'components/Extension/Context/StorageContext';
import { GithubPullRequest, GithubPullRequestChanges } from 'types/Github';

import { ExtensionPopupPullRequestsMenu } from './Menu';
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

const ExtensionPopupPullRequests: React.FC = () => {
	const storageData = useStorageContext();
	const storageHandlers = useStorageHandlerContext();

	const selectedTab = storageData?.popup_tab_id ?? 'all';
	const [user, setUser] = React.useState<any>();

	const [pullRequests, setPullRequests] = React.useState<GithubPullRequest[]>([]);
	const [pullRequestsChanges, setPullRequestsChanges] = React.useState<Record<string, GithubPullRequestChanges>>({});
	const [loadingPullRequests, setLoadingPullRequests] = React.useState<boolean>(false);
	const [hasReceivedPullRequests, setHasReceivedPullRequests] = React.useState<boolean>(false);

	const messageHandlers = useMessageHandlersContext()!;
	const pageHandlers = usePageHandlerContext()!;

	const theme = useTheme();

	React.useEffect(() => {
		messageHandlers.sendBackgroundMessage({ type: 'get_user' });
		messageHandlers.sendBackgroundMessage({ type: 'get_pull_requests' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'pull_requests_loading') setLoadingPullRequests(true);
			else if (message.type === 'pull_requests_updated') {
				setPullRequests(message.data.pullRequests);
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
				<Flex alignItems="center" flexShrink={0} ml="auto">
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

	const onChangeTab = React.useCallback(
		(tabId: PullRequestFilter) => {
			storageHandlers?.setStorageItem(POPUP_TAB_ID_KEY, tabId);
		},
		[storageHandlers]
	);

	const filteredGithubPullRequests = React.useMemo(() => {
		const hiddenPullRequests = storageData?.popup_hidden_pull_requests ?? {};
		const starredPullRequests = storageData?.popup_starred_pull_requests ?? {};

		const orderedPullRequests = orderBy(
			pullRequests,
			[pr => starredPullRequests[__getPullRequestChangeKey(pr)], 'updated_at'],
			['asc', 'desc']
		);

		return orderedPullRequests.reduce(
			(prev: Record<PullRequestFilter, GithubPullRequest[]>, pr: GithubPullRequest) => {
				if (hiddenPullRequests[__getPullRequestChangeKey(pr)]) prev.hidden.push(pr);
				else {
					prev.all.push(pr);
					if (pr.user.username === user?.login) prev.mine.push(pr);
					if (starredPullRequests[__getPullRequestChangeKey(pr)]) prev.starred.push(pr);
				}

				return prev;
			},
			{ all: [], mine: [], starred: [], hidden: [] }
		);
	}, [pullRequests, storageData?.popup_hidden_pull_requests, storageData?.popup_starred_pull_requests, user?.login]);

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
					<Icon.FontAwesome aspectSize="xs" icon={regular('circle-user')} />
					<GithubTabs.Text>Created by me</GithubTabs.Text>
					{filteredGithubPullRequests.mine.length > 0 && (
						<Counter aspectSize="s" numberOfItems={filteredGithubPullRequests.mine.length} />
					)}
				</GithubTabs.Tab>
				<GithubTabs.Tab id="starred">
					<Icon.FontAwesome aspectSize="s" icon={regular('star')} />
					<GithubTabs.Text>Starred</GithubTabs.Text>
					{filteredGithubPullRequests.starred.length > 0 && (
						<Counter aspectSize="s" numberOfItems={filteredGithubPullRequests.starred.length} />
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
			case 'starred':
				finalPullRequests = filteredGithubPullRequests.starred;
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
				<Flex alignItems="center" flexDirection="column" height="100%" justifyContent="center" rowGap={1}>
					<Icon.FontAwesome
						aspectSize="m"
						icon={regular('face-frown')}
						bounce
						style={{ '--fa-animation-iteration-count': 2 } as any}
					/>
					<Text aspectSize="m">Oups! No pull requests have been found.</Text>
				</Flex>
			);

		const hiddenPullRequests = storageData?.popup_hidden_pull_requests ?? {};
		const starredPullRequests = storageData?.popup_starred_pull_requests ?? {};

		return finalPullRequests.map(pr => {
			const repoUrl = getRepositoryUrl(pr.owner, pr.repository);
			const prUrl = getPullRequestUrl(pr.owner, pr.repository, pr.number);
			const userUrl = getUserUrl(pr.user.username);
			const prKey = __getPullRequestChangeKey(pr);
			const prIcon = starredPullRequests[prKey] ? solid('star') : solid('code-pull-request');
			return (
				<StyledPullRequest key={prKey}>
					<Flex flexShrink={0} marginX={2}>
						<Icon.FontAwesome color="primary.500" icon={prIcon} size={14} />
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
					<ExtensionPopupPullRequestsMenu
						isHidden={hiddenPullRequests[prKey]}
						isStarred={starredPullRequests[prKey]}
						onHideClick={() => {
							const newHiddenPrs = { ...hiddenPullRequests };
							if (hiddenPullRequests[prKey]) delete newHiddenPrs[prKey];
							else newHiddenPrs[prKey] = true;

							storageHandlers?.setStorageItem(POPUP_HIDDEN_PULL_REQUESTS_KEY, newHiddenPrs);
						}}
						onStarClick={() => {
							const newStarredPrs = { ...starredPullRequests };
							if (starredPullRequests[prKey]) delete newStarredPrs[prKey];
							else newStarredPrs[prKey] = true;

							storageHandlers?.setStorageItem(POPUP_STARRED_PULL_REQUESTS_KEY, newStarredPrs);
						}}
					/>
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
		storageData?.popup_hidden_pull_requests,
		storageData?.popup_starred_pull_requests,
		storageHandlers,
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
