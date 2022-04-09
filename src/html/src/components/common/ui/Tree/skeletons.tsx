import React from 'react';
import { Box, Skeleton, SkeletonRectProps } from '@sergiogc9/react-ui';

const yDiff = 25;
const x = 20;
const iconWidth = 15;
const lineWidth = '50%';
const height = 15;
const radius = 0;

const TreeSkeleton = () => {
	let y = 0;
	const folderWidth = 'calc(100% - 25px)';

	const commonProps: SkeletonRectProps = {
		borderRadius: radius,
		height,
		position: 'absolute'
	};

	// eslint-disable-next-line no-return-assign
	return (
		<Box p={2}>
			<Skeleton height={140}>
				<Skeleton.Rect {...commonProps} left={0} top={y} width={iconWidth} />
				<Skeleton.Rect {...commonProps} left={x} top={y} width={folderWidth} />
				<Skeleton.Rect {...commonProps} left={x} top={(y += yDiff)} width={iconWidth} />
				<Skeleton.Rect {...commonProps} left={x * 2} top={y} width={lineWidth} />

				<Skeleton.Rect {...commonProps} left={x} top={(y += yDiff)} width={iconWidth} />
				<Skeleton.Rect {...commonProps} left={x * 2} top={y} width={lineWidth} />

				<Skeleton.Rect {...commonProps} left={0} top={y} width={iconWidth} />
				<Skeleton.Rect {...commonProps} left={x} top={y} width={folderWidth} />
				<Skeleton.Rect {...commonProps} left={x} top={(y += yDiff)} width={iconWidth} />
				<Skeleton.Rect {...commonProps} left={x * 2} top={y} width={lineWidth} />

				<Skeleton.Rect {...commonProps} left={0} top={(y += yDiff)} width={iconWidth} />
				<Skeleton.Rect {...commonProps} left={x} top={y} width={lineWidth} />

				<Skeleton.Rect {...commonProps} left={0} top={(y += yDiff)} width={iconWidth} />
				<Skeleton.Rect {...commonProps} left={x} top={y} width={lineWidth} />
			</Skeleton>
		</Box>
	);
};

type TreeFolderSkeletonProps = {
	deep: number;
};

const TreeFolderSkeleton = ({ deep }: TreeFolderSkeletonProps) => {
	let y = 0;

	const commonProps: SkeletonRectProps = {
		borderRadius: radius,
		height,
		position: 'absolute'
	};

	const wrapperPaddingLeft = ` ${(deep + 2) * 10}px`;

	// eslint-disable-next-line no-return-assign
	return (
		<Box paddingLeft={wrapperPaddingLeft} my={1}>
			<Skeleton height={66}>
				<Skeleton.Rect {...commonProps} left={0} top={y} width={iconWidth} />
				<Skeleton.Rect {...commonProps} left={x} top={y} width={lineWidth} />

				<Skeleton.Rect {...commonProps} left={0} top={(y += yDiff)} width={iconWidth} />
				<Skeleton.Rect {...commonProps} left={x} top={y} width={lineWidth} />

				<Skeleton.Rect {...commonProps} left={0} top={(y += yDiff)} width={iconWidth} />
				<Skeleton.Rect {...commonProps} left={x} top={y} width={lineWidth} />
			</Skeleton>
		</Box>
	);
};

export { TreeSkeleton, TreeFolderSkeleton };
