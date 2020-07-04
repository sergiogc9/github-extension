import React from 'react';
import values from 'lodash/values';

import { GithubReviews } from 'types/Github';
import { MaterialUIIcon, NucleoIcon, FontAwesomeIcon } from 'components/common/Icon/Icon';

import './PullRequestReviewers.scss';

type ComponentProps = { reviews?: GithubReviews };

const PullRequestReviewers: React.FC<ComponentProps> = props => {
	const { reviews } = props;

	if (!reviews) return null;

	const content = values(reviews).map(review => {
		let icon;
		if (review.state === 'APPROVED') icon = <MaterialUIIcon name='check' />;
		else if (review.state === 'CHANGES_REQUESTED') icon = <FontAwesomeIcon name='times' type='light' />;
		else if (review.state === 'COMMENTED') icon = <NucleoIcon name='a-chat' type='solid' />;
		else icon = <div className='pending-circle'></div>;

		return (
			<div className='pull-request-reviewer' key={review.user}>
				<img src={review.userImgUrl + "&s=20"} alt='' />
				<span>{review.user}</span>
				{icon}
			</div>
		);
	});

	return (
		<div id="githubExtensionPullRequestReviewers">
			{content}
		</div>
	);
};

export default React.memo(PullRequestReviewers);
