import React from 'react';
import get from 'lodash/get';
import size from 'lodash/size';
import filter from 'lodash/filter';
import values from 'lodash/values';
import Button from '@material-ui/core/Button';

import { MaterialUIIcon, SymbolicIcon, FontAwesomeIcon } from 'components/common/Icon/Icon';
import { GithubPullRequest } from 'types/Github';
import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';

import './PullRequestActions.scss';

type ComponentProps = {
	pullRequest: GithubPullRequest,
	onActionDone: Function
};

const PullRequestActions: React.FC<ComponentProps> = props => {
	const { pullRequest } = props;
	const { onActionDone } = props;

	const [user, setUser] = React.useState<any>();

	const messageHandlers = React.useContext(MessageHandlersContext)!;

	React.useEffect(() => {
		messageHandlers.sendBackgroundMessage({ type: 'get_user' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'user_updated') setUser(message.data);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const content = React.useMemo(() => {
		if (!user || !pullRequest) return null;
		if (pullRequest.merged) return (
			<Button variant="contained" className='merge-btn full-width' size='small' disabled disableElevation
				startIcon={<SymbolicIcon name='pull-request' type='duo' />}>MERGED</Button>
		);

		const { reviews, checks } = pullRequest;
		const isPullRequestFromUser = pullRequest.user.username === user.login;
		const userReviewStatus = get(reviews, [user.login, 'state']);
		const approvedReviews = size(filter(values(reviews), { state: 'APPROVED' }));
		const changesRequestedReviews = size(filter(values(reviews), { state: 'CHANGES_REQUESTED' }));
		const prHasAllChecksSuccess = !checks || (checks.pending === 0 && checks.failed === 0);

		const approveBtn = !isPullRequestFromUser && userReviewStatus !== 'APPROVED' && <Button variant="contained" className='approve-btn' size='small' disableElevation
			startIcon={<MaterialUIIcon name='check' />}>APPROVE</Button>;
		const requestChangesBtn = !isPullRequestFromUser && userReviewStatus !== 'CHANGES_REQUESTED' && <Button variant="contained" className='request-changes-btn' size='small' disableElevation
			startIcon={<FontAwesomeIcon name='times' type='light' />}>CHANGE</Button>;
		const { text, disabled, btnClass } = pullRequest.state === 'open'
			&& pullRequest.mergeable
			&& (!pullRequest.mergeable_status || pullRequest.mergeable_status === 'clean')
			&& approvedReviews > 0
			&& changesRequestedReviews === 0
			&& prHasAllChecksSuccess ? { text: "MERGE", disabled: false, btnClass: 'merge' } : { text: "MERGING IS BLOCKED", disabled: true, btnClass: 'disabled' };
		const mergeBtn = <Button variant="contained" className={`${btnClass}-btn full-width`} size='small' disableElevation disabled={disabled}
			startIcon={<SymbolicIcon name='pull-request' type='duo' />}>{text}</Button>;

		return (
			<>
				{approveBtn}
				{requestChangesBtn}
				{mergeBtn}
			</>
		);
	}, [user, pullRequest]);

	return (
		<div id="githubExtensionPullRequestActions">
			{content}
		</div>
	);
};

export default React.memo(PullRequestActions);
