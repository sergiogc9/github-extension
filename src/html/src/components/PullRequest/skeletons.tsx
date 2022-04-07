import React from 'react';
import { Skeleton } from '@sergiogc9/react-ui';

const HeaderBranchSkeleton = () => {
	return (
		<Skeleton height={49}>
			<Skeleton.Rect borderRadius={0} height={15} left="30%" position="absolute" width="40%" />
			<Skeleton.Circle left="calc(50% - 5px)" position="absolute" size={10} top={20} />
			<Skeleton.Rect borderRadius={0} height={15} left="25%" position="absolute" top={34} width="50%" />
		</Skeleton>
	);
};

export { HeaderBranchSkeleton };
