import React from 'react';
import { useTheme } from 'styled-components';
import { useAsync } from 'react-async';
import isEmpty from 'lodash/isEmpty';
import numeral from 'numeral';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Flex, Icon, Text } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';

import GithubApi from 'lib/Github/GithubApi';
import { usePageContext } from 'components/Extension/Context/PageContext';
import { useMessageHandlersContext } from 'components/Extension/Context/MessageContext';
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
	StyledPullRequestInfo,
	StyledPullRequestInfoElement
} from './styled';

const PullRequest: React.FC = () => {
	const pageData = usePageContext()!;
	const messageHandlers = useMessageHandlersContext()!;

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
					bg="github.branch.bg"
					color="github.branch.text"
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
				<Icon.FontAwesome color="github.branch.text" icon={solid('caret-up')} size={13} mt="2px" />
				<Text
					aspectSize="xs"
					bg="github.branch.bg"
					color="github.branch.text"
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
	}, [isLoading, pullRequest]);

	const headerContent = React.useMemo(() => {
		const { user, repository } = pageData.data;
		return (
			<StyledPullRequestHeader>
				<StyledPullRequestHeaderTitle>
					<Icon.FontAwesome color="common.text" icon={solid('code-pull-request')} size={14} />
					<StyledPullRequestHeaderLink
						color={getColorByMode(theme, { light: 'neutral.800', dark: 'neutral.100' })}
						href={`https://github.com/${user}`}
					>
						{user}
					</StyledPullRequestHeaderLink>
					<Text color={getColorByMode(theme, { light: 'neutral.600', dark: 'neutral.500' })}>/</Text>
					<StyledPullRequestHeaderLink
						color="common.text"
						fontWeight="bold"
						href={`https://github.com/${user}/${repository}`}
					>
						{repository}
					</StyledPullRequestHeaderLink>
				</StyledPullRequestHeaderTitle>
				<StyledPullRequestHeaderBranch>{branchContent}</StyledPullRequestHeaderBranch>
			</StyledPullRequestHeader>
		);
	}, [pageData.data, theme, branchContent]);

	const infoContent = React.useMemo(() => {
		const textCommonProps = { fontSize: '11px', lineHeight: '11px' };

		const content =
			pullRequest && !isLoading ? (
				<>
					<StyledPullRequestInfoElement title="Commits">
						<Icon.FontAwesome
							color={getColorByMode(theme, { light: 'primary.400', dark: 'primary.500' })}
							icon={solid('code-commit')}
							size={14}
						/>
						<Text {...textCommonProps}>{pullRequest.commits}</Text>
					</StyledPullRequestInfoElement>
					<StyledPullRequestInfoElement title="Files">
						<Icon.FontAwesome
							color={getColorByMode(theme, { light: 'primary.400', dark: 'primary.500' })}
							icon={solid('copy')}
							size={14}
						/>
						<Text {...textCommonProps}>{pullRequest.changedFiles}</Text>
					</StyledPullRequestInfoElement>
					<StyledPullRequestInfoElement title="Comments">
						<Icon.FontAwesome
							color={getColorByMode(theme, { light: 'primary.400', dark: 'primary.500' })}
							icon={solid('message')}
							size={14}
						/>
						<Text {...textCommonProps}>{pullRequest.comments + pullRequest.reviewComments}</Text>
					</StyledPullRequestInfoElement>
					<StyledPullRequestInfoElement title="Lines added" className="info-additions">
						<Icon.FontAwesome color="green.600" icon={solid('square')} size={7} />
						<Text {...textCommonProps}>+{numeral(pullRequest.additions).format('0a')}</Text>
					</StyledPullRequestInfoElement>
					<StyledPullRequestInfoElement title="Lines deleted" className="info-deletions">
						<Icon.FontAwesome color="red.600" icon={solid('square')} size={7} />
						<Text {...textCommonProps}>-{numeral(pullRequest.deletions).format('0a')}</Text>
					</StyledPullRequestInfoElement>
				</>
			) : (
				<PullRequestInfoSkeleton />
			);

		return <StyledPullRequestInfo>{content}</StyledPullRequestInfo>;
	}, [pullRequest, isLoading, theme]);

	const labelsContent = React.useMemo(() => {
		if (!pullRequest || isLoading || isEmpty(pullRequest.labels)) return null;
		return (
			<Flex flexWrap="wrap" justifyContent="center" paddingX={1} paddingTop={1}>
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
			<Flex justifyContent="center" padding={2} paddingTop={0}>
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
