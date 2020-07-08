import React from 'react';
import { useAsync } from 'react-async';
import get from 'lodash/get';
import size from 'lodash/size';
import filter from 'lodash/filter';
import values from 'lodash/values';
import Button from '@material-ui/core/Button';
import HashLoader from "react-spinners/HashLoader";

import GithubApi from 'lib/Github/GithubApi';
import { PageContext } from 'components/Extension/Context/PageContext';
import { AlertContext } from 'components/Extension/Context/AlertContext';
import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { MaterialUIIcon, SymbolicIcon, FontAwesomeIcon } from 'components/common/Icon/Icon';
import { GithubPullRequest } from 'types/Github';

import './PullRequestActions.scss';

type ComponentProps = {
	pullRequest: GithubPullRequest
};

const PullRequestActions: React.FC<ComponentProps> = props => {
	const { pullRequest } = props;

	const [user, setUser] = React.useState<any>();

	const pageData = React.useContext(PageContext)!;
	const messageHandlers = React.useContext(MessageHandlersContext)!;
	const alertHandlers = React.useContext(AlertContext)!;

	const { run: runAction, data: prActionEvent, isLoading: prActionEventLoading } = useAsync({ deferFn: GithubApi.submitPullRequestReview, onReject: alertHandlers.onGithubApiError });
	const { run: runMerge, data: prActionMerged, isLoading: prActionMergeLoading } = useAsync({ deferFn: GithubApi.mergePullRequest, onReject: alertHandlers.onGithubApiError });

	React.useEffect(() => {
		messageHandlers.sendBackgroundMessage({ type: 'get_user' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'user_updated') setUser(message.data);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const content = React.useMemo(() => {
		if (!user || !pullRequest) return null;
		if (prActionEventLoading || prActionMergeLoading) return <div className='action-loader'><HashLoader size={20} color='#1E90FF' /></div>;
		if (pullRequest.merged || prActionMerged) return (
			<Button variant="contained" className='merge-btn full-width' size='small' disabled disableElevation
				startIcon={<SymbolicIcon name='pull-request' type='duo' />}>MERGED</Button>
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

		const approveBtn = !isPullRequestFromUser && userReviewStatus !== 'APPROVED' && <Button variant="contained" className='approve-btn' size='small' disableElevation
			startIcon={<MaterialUIIcon name='check' />} onClick={() => runAction({ ...pageData.data, username: user.login, event: 'APPROVE' })}>APPROVE</Button>;
		const requestChangesBtn = !isPullRequestFromUser && <Button variant="contained" className='request-changes-btn' size='small' disableElevation
			startIcon={<FontAwesomeIcon name='times' type='light' />}
			onClick={() => {
				const comment = prompt('Leave a comment:');
				if (comment) runAction({ ...pageData.data, username: user.login, event: 'CHANGES_REQUESTED', comment });
			}}>CHANGE</Button>;
		const { text, disabled, btnClass } = pullRequest.state === 'open'
			&& pullRequest.mergeable
			&& (!pullRequest.mergeable_status || pullRequest.mergeable_status === 'clean')
			&& approvedReviews > 0
			&& changesRequestedReviews === 0
			&& prHasAllChecksSuccess ? { text: "MERGE", disabled: false, btnClass: 'merge' } : { text: "MERGING IS BLOCKED", disabled: true, btnClass: 'disabled' };
		const mergeBtn = <Button variant="contained" className={`${btnClass}-btn full-width`} size='small' disableElevation disabled={disabled}
			startIcon={<SymbolicIcon name='pull-request' type='duo' />} onClick={() => runMerge(pageData.data)}>{text}</Button>;

		return (
			<>
				{approveBtn}
				{requestChangesBtn}
				{mergeBtn}
			</>
		);
	}, [user, pullRequest, pageData, prActionEvent, prActionMerged, prActionEventLoading, prActionMergeLoading, runAction, runMerge]);

	return (
		<div id="githubExtensionPullRequestActions">
			{content}
		</div>
	);
};

export default React.memo(PullRequestActions);
