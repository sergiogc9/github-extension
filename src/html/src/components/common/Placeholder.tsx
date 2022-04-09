import React from 'react';
import ContentLoader from 'react-content-loader';

export const PullRequestInfoPlaceholder: React.FC = React.memo(() => {
	return (
		<ContentLoader className="placeholder" height={15}>
			<rect x="5%" y="0" width="90%" height="15" rx={5} ry={5} />
		</ContentLoader>
	);
});

export const PullRequestReviewsPlaceholder: React.FC = React.memo(() => {
	return (
		<ContentLoader className="placeholder" height={40}>
			<rect x="0%" y="0" width="49%" height="15" rx={5} ry={5} />
			<rect x="0%" y="20" width="49%" height="15" rx={5} ry={5} />
			<rect x="70%" y="0" width="45" height="35" rx={5} ry={5} />
		</ContentLoader>
	);
});

export const PullRequestActionsPlaceholder: React.FC = React.memo(() => {
	return (
		<ContentLoader className="placeholder" height={40}>
			<rect x="0%" y="0" width="49%" height="15" rx={5} ry={5} />
			<rect x="51%" y="0" width="49%" height="15" rx={5} ry={5} />
			<rect x="0%" y="20" width="100%" height="15" rx={5} ry={5} />
		</ContentLoader>
	);
});
