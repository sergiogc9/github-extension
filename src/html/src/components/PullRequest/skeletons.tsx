import React from 'react';
import { Box, Skeleton } from '@sergiogc9/react-ui';

const PullRequestHeaderBranchSkeleton = () => {
	return (
		<Skeleton height={49}>
			<Skeleton.Rect borderRadius={0} height={15} left="30%" position="absolute" width="40%" />
			<Skeleton.Circle left="calc(50% - 5px)" position="absolute" size={10} top={20} />
			<Skeleton.Rect borderRadius={0} height={15} left="25%" position="absolute" top={34} width="50%" />
		</Skeleton>
	);
};

const PullRequestInfoSkeleton = () => {
	return (
		<Skeleton height={15}>
			<Skeleton.Rect borderRadius={0} height={15} left="5%" position="absolute" width="90%" />
		</Skeleton>
	);
};

const PullRequestReviewsSkeleton = () => {
	return (
		<Box p={2}>
			<Skeleton height={50}>
				<Skeleton.Rect borderRadius={0} height={20} left="0%" position="absolute" width="49%" />
				<Skeleton.Rect borderRadius={0} height={20} left="0%" position="absolute" top={25} width="49%" />
				<Skeleton.Rect borderRadius={0} height={45} left="70%" position="absolute" width="15%" />
			</Skeleton>
		</Box>
	);
};

const PullRequestActionsSkeleton = () => {
	return (
		<Box p={2}>
			<Skeleton height={45}>
				<Skeleton.Rect borderRadius={0} height={20} left="0%" position="absolute" width="49%" />
				<Skeleton.Rect borderRadius={0} height={20} left="51%" position="absolute" width="49%" />
				<Skeleton.Rect borderRadius={0} height={20} left="0%" position="absolute" top={25} width="100%" />
			</Skeleton>
		</Box>
	);
};

export {
	PullRequestActionsSkeleton,
	PullRequestHeaderBranchSkeleton,
	PullRequestInfoSkeleton,
	PullRequestReviewsSkeleton
};
