import React from 'react';
import { useAsync } from 'react-async';
import get from 'lodash/get';
import size from 'lodash/size';
import filter from 'lodash/filter';
import values from 'lodash/values';
import HashLoader from 'react-spinners/HashLoader';
import { duotone, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Button, Flex } from '@sergiogc9/react-ui';

import GithubApi from 'lib/Github/GithubApi';
import { usePageContext } from 'components/Extension/Context/PageContext';
import { useMessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { useOnGithubApiError } from 'lib/hooks/useOnGithubApiError';
import { GithubPullRequest } from 'types/Github';

type ComponentProps = {
	pullRequest: GithubPullRequest;
};

const PullRequestActions: React.FC<ComponentProps> = props => {
	const { pullRequest } = props;

	const [user, setUser] = React.useState<any>();

	const pageData = usePageContext()!;
	const messageHandlers = useMessageHandlersContext()!;

	const { onGithubApiError } = useOnGithubApiError();

	const {
		run: runAction,
		data: prActionEvent,
		isLoading: prActionEventLoading
	} = useAsync({
		deferFn: GithubApi.submitPullRequestReview,
		onReject: onGithubApiError
	});
	const {
		run: runMerge,
		data: prActionMerged,
		isLoading: prActionMergeLoading
	} = useAsync({
		deferFn: GithubApi.mergePullRequest,
		onReject: onGithubApiError
	});

	React.useEffect(() => {
		messageHandlers.sendBackgroundMessage({ type: 'get_user' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'user_updated') setUser(message.data);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const content = React.useMemo(() => {
		if (!user || !pullRequest) return null;
		if (prActionEventLoading || prActionMergeLoading)
			return (
				<Flex justifyContent="center" py={3} width="100%">
					<HashLoader size={20} color="#1E90FF" />
				</Flex>
			);

		if (pullRequest.merged || prActionMerged)
			return (
				<Button aspectSize="xs" isDisabled variant="default" width="100%">
					<Button.Icon.FontAwesome icon={duotone('code-pull-request')} />
					<Button.Text>MERGED</Button.Text>
				</Button>
			);
		if (pullRequest.state === 'closed')
			return (
				<Button aspectSize="xs" isDisabled variant="danger" width="100%">
					<Button.Icon.FontAwesome icon={duotone('code-pull-request-closed')} />
					<Button.Text>CLOSED</Button.Text>
				</Button>
			);

		const { reviews, checks } = pullRequest;
		const isPullRequestFromUser = pullRequest.user.username === user.login;
		const prHasAllChecksSuccess = !checks || (checks.pending === 0 && checks.failed === 0);
		let userReviewStatus = get(reviews, [user.login, 'state']);
		let approvedReviews = size(filter(values(reviews), { state: 'APPROVED' }));
		let changesRequestedReviews = size(filter(values(reviews), { state: 'CHANGES_REQUESTED' }));

		if (prActionEvent === 'APPROVED') {
			if (userReviewStatus === 'CHANGES_REQUESTED') changesRequestedReviews--;
			userReviewStatus = 'APPROVED';
			approvedReviews++;
		} else if (prActionEvent === 'CHANGES_REQUESTED') {
			userReviewStatus = 'CHANGES_REQUESTED';
			changesRequestedReviews++;
		}

		const approveBtn = !isPullRequestFromUser && userReviewStatus !== 'APPROVED' && (
			<Button
				aspectSize="xs"
				onClick={() =>
					runAction({
						...pageData.data,
						username: user.login,
						event: 'APPROVE'
					})
				}
				variant="success"
				width="49%"
			>
				<Button.Icon.FontAwesome icon={solid('check')} />
				<Button.Text>APPROVE</Button.Text>
			</Button>
		);
		const requestChangesBtn = !isPullRequestFromUser && (
			<Button
				aspectSize="xs"
				onClick={() => {
					// eslint-disable-next-line no-alert
					const comment = prompt('Leave a comment:');
					if (comment)
						runAction({
							...pageData.data,
							username: user.login,
							event: 'CHANGES_REQUESTED',
							comment
						});
				}}
				variant="danger"
				width={userReviewStatus !== 'APPROVED' ? '49%' : '100%'}
			>
				<Button.Icon.FontAwesome icon={solid('xmark')} />
				<Button.Text>CHANGE</Button.Text>
			</Button>
		);
		const { text, disabled } =
			pullRequest.state === 'open' &&
			pullRequest.mergeable &&
			(!pullRequest.mergeable_status || pullRequest.mergeable_status === 'clean') &&
			approvedReviews > 0 &&
			changesRequestedReviews === 0 &&
			prHasAllChecksSuccess
				? { text: 'MERGE', disabled: false }
				: { text: 'MERGING IS BLOCKED', disabled: true };

		const mergeBtn = (
			<Button
				aspectSize="xs"
				isDisabled={disabled}
				onClick={() => runMerge(pageData.data)}
				variant="default"
				width="100%"
			>
				<Button.Icon.FontAwesome icon={duotone('code-pull-request')} />
				<Button.Text>{text}</Button.Text>
			</Button>
		);

		return (
			<>
				{approveBtn}
				{requestChangesBtn}
				{mergeBtn}
			</>
		);
	}, [
		user,
		pullRequest,
		pageData,
		prActionEvent,
		prActionMerged,
		prActionEventLoading,
		prActionMergeLoading,
		runAction,
		runMerge
	]);

	return (
		<Flex id="githubExtensionPullRequestActions" flexWrap="wrap" rowGap={1} justifyContent="space-between" width="100%">
			{content}
		</Flex>
	);
};

export default React.memo(PullRequestActions);
