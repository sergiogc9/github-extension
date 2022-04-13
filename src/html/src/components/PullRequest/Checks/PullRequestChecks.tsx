import React from 'react';
import map from 'lodash/map';
import size from 'lodash/size';
import filter from 'lodash/filter';
import { ResponsivePie, PieDatum } from '@nivo/pie';
import { Box, Flex, Text } from '@sergiogc9/react-ui';

import { GithubPullRequest } from 'types/Github';

const getPieColor = (data: PieDatum): string => {
	if (data.id === 'success') return '#388e3cdf';
	if (data.id === 'pending') return '#ffa500df';
	if (data.id === 'neutral') return '#58606B';
	if (data.id === 'failed') return '#d32f2fdf';
	return '#e1e4e8';
};

type ComponentProps = { pullRequest: GithubPullRequest };

const PullRequestChecks: React.FC<ComponentProps> = props => {
	const { pullRequest } = props;

	const { checks } = pullRequest;

	const pieContent = React.useMemo(() => {
		const data: PieDatum[] =
			checks?.failed || checks?.pending || checks?.success
				? map(checks, (count, key) => ({ id: key, value: count }))
				: [{ id: 'disabled', value: 1 }];

		return (
			<ResponsivePie
				data={data}
				innerRadius={0.65}
				cornerRadius={2}
				padAngle={size(filter(checks, c => !!c)) > 1 ? 4 : 0}
				colors={getPieColor}
				enableRadialLabels={false}
				enableSlicesLabels={false}
				isInteractive={false}
			/>
		);
	}, [checks]);

	const content = React.useMemo(() => {
		const checksTexts: string[] = [];
		if ((checks?.failed === 0 && checks.pending === 0 && checks.success === 0) || !checks)
			checksTexts.push('No checks');
		else {
			if (checks.success) checksTexts.push(`${checks.success} success`);
			if (checks.pending) checksTexts.push(`${checks.pending} pending`);
			if (checks.neutral) checksTexts.push(`${checks.neutral} neutral`);
			if (checks.failed) checksTexts.push(`${checks.failed} failed`);
		}

		return (
			<>
				<Box height={20} mt={1} mb={2}>
					{pieContent}
				</Box>
				<Flex alignItems="center" rowGap="1px" flexDirection="column">
					{checksTexts.map((text, i) => (
						// eslint-disable-next-line react/no-array-index-key
						<Text key={i} fontSize="9px" lineHeight="9px" textTransform="uppercase">
							{text}
						</Text>
					))}
				</Flex>
			</>
		);
	}, [checks, pieContent]);

	return <Box width="50%">{content}</Box>;
};

export default React.memo(PullRequestChecks);
