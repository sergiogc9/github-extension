import React from 'react';
import { useTheme } from 'styled-components';
import { useAsync } from 'react-async';
import isEmpty from 'lodash/isEmpty';
import numeral from 'numeral';
import { Flex, Text } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';

import GithubApi from 'lib/Github/GithubApi';
import { PageContext } from 'components/Extension/Context/PageContext';
import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { FontAwesomeIcon, SymbolicIcon } from 'components/common/Icon/Icon';
import GithubLabel from 'components/common/ui/GithubLabel/GithubLabel';
import { useOnGithubApiError } from 'lib/hooks/useOnGithubApiError';

import PullRequestTree from './Tree/PullRequestTree';
import PullRequestChecks from './Checks/PullRequestChecks';
import PullRequestActions from './Actions/PullRequestActions';
import PullRequestReviewers from './Reviewers/PullRequestReviewers';

import {
	PullRequestActionsSkeleton,
	PullRequestHeaderBranchSkeleton,
	PullRequestInfoSkeleton,
	PullRequestReviewsSkeleton
} from './skeletons';
import {
	StyledPullRequestHeader,
	StyledPullRequestHeaderBranch,
	StyledPullRequestHeaderLink,
	StyledPullRequestHeaderTitle,
	StyledPullRequestInfoElement
} from './styled';

const PullRequest: React.FC = () => {
	const pageData = React.useContext(PageContext)!;
	const messageHandlers = React.useContext(MessageHandlersContext)!;

	const theme = useTheme();

	const { onGithubApiError } = useOnGithubApiError();

	const { data: pullRequest, isLoading } = useAsync({
		promiseFn: GithubApi.getPullRequestInfo,
		data: pageData.data,
		onReject: onGithubApiError
	});

	React.useEffect(() => {
		if (pullRequest)
			messageHandlers.sendBackgroundMessage({
				type: 'pull_request_seen',
				data: pullRequest
			});
	}, [pullRequest]); // eslint-disable-line react-hooks/exhaustive-deps

	const branchContent = React.useMemo(() => {
		if (isLoading) return <PullRequestHeaderBranchSkeleton />;
		if (!pullRequest) return null;

		return (
			<>
				<Text
					aspectSize="xs"
					bg={getColorByMode(theme, { light: 'primary.100', dark: 'neutral.700' })}
					color={getColorByMode(theme, { light: 'primary.800', dark: 'primary.400' })}
					lineHeight="10px"
					fontSize="10px"
					maxWidth="100%"
					p={1}
					textOverflow="ellipsis"
					overflow="hidden"
					whiteSpace="nowrap"
				>
					{pullRequest.branches!.base}
				</Text>
				<FontAwesomeIcon name="caret-up" type="solid" />
				<Text
					aspectSize="xs"
					bg={getColorByMode(theme, { light: 'primary.100', dark: 'neutral.700' })}
					color={getColorByMode(theme, { light: 'primary.800', dark: 'primary.400' })}
					lineHeight="10px"
					fontSize="10px"
					maxWidth="100%"
					p={1}
					textOverflow="ellipsis"
					overflow="hidden"
					whiteSpace="nowrap"
				>
					{pullRequest.branches!.head}
				</Text>
			</>
		);
	}, [isLoading, pullRequest, theme]);

	const headerContent = React.useMemo(() => {
		const { user, repository } = pageData.data;
		return (
			<StyledPullRequestHeader>
				<StyledPullRequestHeaderTitle>
					<SymbolicIcon name="pull-request" type="duo" />
					<StyledPullRequestHeaderLink href={`https://github.com/${user}`}>{user}</StyledPullRequestHeaderLink>
					<FontAwesomeIcon name="chevron-double-right" type="solid" />
					<StyledPullRequestHeaderLink fontWeight="bold" href={`hhttps://github.com/${user}/${repository}`}>
						{repository}
					</StyledPullRequestHeaderLink>
				</StyledPullRequestHeaderTitle>
				<StyledPullRequestHeaderBranch>{branchContent}</StyledPullRequestHeaderBranch>
			</StyledPullRequestHeader>
		);
	}, [pageData.data, branchContent]);

	const infoContent = React.useMemo(() => {
		const content =
			pullRequest && !isLoading ? (
				<>
					<StyledPullRequestInfoElement title="Commits">
						<FontAwesomeIcon name="code-commit" type="duo" />
						<span>{pullRequest.commits}</span>
					</StyledPullRequestInfoElement>
					<StyledPullRequestInfoElement title="Files">
						<FontAwesomeIcon name="copy" type="duo" />
						<span>{pullRequest.changedFiles}</span>
					</StyledPullRequestInfoElement>
					<StyledPullRequestInfoElement title="Comments">
						<SymbolicIcon name="chat-conversation-alt" type="solid" />
						<span>{pullRequest.comments + pullRequest.reviewComments}</span>
					</StyledPullRequestInfoElement>
					<StyledPullRequestInfoElement title="Lines added" className="info-additions">
						<FontAwesomeIcon name="square" type="solid" />
						<span className="text-small">+</span>
						<span>{numeral(pullRequest.additions).format('0a')}</span>
					</StyledPullRequestInfoElement>
					<StyledPullRequestInfoElement title="Lines deleted" className="info-deletions">
						<FontAwesomeIcon name="square" type="solid" />
						<span className="text-small">-</span>
						<span>{numeral(pullRequest.deletions).format('0a')}</span>
					</StyledPullRequestInfoElement>
				</>
			) : (
				<PullRequestInfoSkeleton />
			);

		return (
			<Flex p={2} justifyContent="space-evenly">
				{content}
			</Flex>
		);
	}, [pullRequest, isLoading]);

	const labelsContent = React.useMemo(() => {
		if (!pullRequest || isLoading || isEmpty(pullRequest.labels)) return null;
		return (
			<Flex flexWrap="wrap" justifyContent="center" padding={1} paddingTop={0}>
				{pullRequest.labels.map(label => (
					<GithubLabel key={label.id} color={`#${label.color}`} text={label.name} />
				))}
			</Flex>
		);
	}, [pullRequest, isLoading]);

	const reviewsContent = React.useMemo(() => {
		if (isLoading || !pullRequest) return <PullRequestReviewsSkeleton />;

		return (
			<Flex alignItems="center" padding={2}>
				<PullRequestReviewers reviews={pullRequest.reviews} />
				<PullRequestChecks pullRequest={pullRequest} />
			</Flex>
		);
	}, [pullRequest, isLoading]);

	const actionsContent = React.useMemo(() => {
		if (isLoading || !pullRequest) return <PullRequestActionsSkeleton />;

		return (
			<Flex justifyContent="center" padding={1} paddingTop={0}>
				<PullRequestActions pullRequest={pullRequest} />
			</Flex>
		);
	}, [pullRequest, isLoading]);

	return (
		<Flex flexDirection="column" flexGrow={1} overflow="hidden">
			{headerContent}
			{infoContent}
			{labelsContent}
			<PullRequestTree />
			{reviewsContent}
			{actionsContent}
		</Flex>
	);
};

export default React.memo(PullRequest);
