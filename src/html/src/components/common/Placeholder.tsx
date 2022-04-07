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

export const TreePlaceHolder: React.FC = React.memo(() => {
	let y = 0;
	const yDiff = 25;
	const x = 20;
	const iconWidth = 15;
	const folderWidth = 'calc(100% - 25px)';
	const lineWidth = '50%';
	const height = 15;
	const radius = 5;

	// eslint-disable-next-line no-return-assign
	return (
		<ContentLoader className="placeholder">
			<rect x={0} y={y} width={iconWidth} height={height} rx={radius} ry={radius} />
			<rect x={x} y={y} width={folderWidth} height={height} rx={radius} ry={radius} />
			<rect x={x} y={(y += yDiff)} width={iconWidth} height={height} rx={radius} ry={radius} />
			<rect x={x * 2} y={y} width={lineWidth} height={height} rx={radius} ry={radius} />
			<rect x={x} y={(y += yDiff)} width={iconWidth} height={height} rx={radius} ry={radius} />
			<rect x={x * 2} y={y} width={lineWidth} height={height} rx={radius} ry={radius} />

			<rect x={0} y={(y += yDiff)} width={iconWidth} height={height} rx={radius} ry={radius} />
			<rect x={x} y={y} width={folderWidth} height={height} rx={radius} ry={radius} />
			<rect x={x} y={(y += yDiff)} width={iconWidth} height={height} rx={radius} ry={radius} />
			<rect x={x * 2} y={y} width={lineWidth} height={height} rx={radius} ry={radius} />

			<rect x={0} y={(y += yDiff)} width={iconWidth} height={height} rx={radius} ry={radius} />
			<rect x={x} y={y} width={lineWidth} height={height} rx={radius} ry={radius} />

			<rect x={0} y={(y += yDiff)} width={iconWidth} height={height} rx={radius} ry={radius} />
			<rect x={x} y={y} width={lineWidth} height={height} rx={radius} ry={radius} />
		</ContentLoader>
	);
});

export const FolderPlaceholder: React.FC = React.memo(() => {
	let y = 0;
	const yDiff = 25;
	const x = 20;
	const iconWidth = 15;
	const lineWidth = '50%';
	const height = 15;
	const radius = 5;

	// eslint-disable-next-line no-return-assign
	return (
		<ContentLoader className="placeholder">
			<rect x={0} y={y} width={iconWidth} height={height} rx={radius} ry={radius} />
			<rect x={x} y={y} width={lineWidth} height={height} rx={radius} ry={radius} />
			<rect x={0} y={(y += yDiff)} width={iconWidth} height={height} rx={radius} ry={radius} />
			<rect x={x} y={y} width={lineWidth} height={height} rx={radius} ry={radius} />
			<rect x={0} y={(y += yDiff)} width={iconWidth} height={height} rx={radius} ry={radius} />
			<rect x={x} y={y} width={lineWidth} height={height} rx={radius} ry={radius} />
		</ContentLoader>
	);
});
