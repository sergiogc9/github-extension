import React from 'react';
import map from 'lodash/map';
import size from 'lodash/size';
import filter from 'lodash/filter';
import { ResponsivePie, PieDatum } from '@nivo/pie';

import { GithubPullRequest, GithubChecks } from 'types/Github';
import { MaterialUIIcon, NucleoIcon, FontAwesomeIcon } from 'components/common/Icon/Icon';

import './PullRequestChecks.scss';

const getPieColor = (data: PieDatum): string => {
	if (data.id === 'success') return '#388e3cdf';
	if (data.id === 'pending') return '#ffa500df';
	if (data.id === 'failed') return '#d32f2fdf';
	return '#e1e4e8';
};

type ComponentProps = { checks?: GithubChecks };

const PullRequestChecks: React.FC<ComponentProps> = props => {
	const { checks } = props;

	const pieContent = React.useMemo(() => {
		const data: PieDatum[] = checks ? map(checks, (count, key) => ({ id: key, value: count })) : [{ id: 'disabled', value: 1 }];

		return <ResponsivePie
			data={data}
			innerRadius={0.65}
			cornerRadius={2}
			padAngle={size(filter(checks, c => !!c)) > 1 ? 4 : 0}
			colors={getPieColor}
			enableRadialLabels={false}
			enableSlicesLabels={false}
			isInteractive={false}
		/>;
	}, [checks]);

	const content = React.useMemo(() => {
		const checksTexts: string[] = [];
		if (!checks) checksTexts.push('No checks');
		else {
			if (checks.success) checksTexts.push(`${checks.success} success`);
			if (checks.pending) checksTexts.push(`${checks.pending} pending`);
			if (checks.failed) checksTexts.push(`${checks.failed} failed`);
		}

		return (
			<>
				<div className='checks-pie'>
					{pieContent}
				</div>
				<div className='checks-text'>
					{checksTexts.map((text, i) => <div key={i}>{text}</div>)}
				</div>
			</>
		);
	}, [checks, pieContent]);

	return (
		<div id="githubExtensionPullRequestChecks">
			{content}
		</div>
	);
};

export default React.memo(PullRequestChecks);
