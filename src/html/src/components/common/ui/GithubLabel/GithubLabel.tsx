import React from 'react';
import Emoji from 'react-emoji-render';

import { getContrastTextColor } from 'lib/color';

import './GithubLabel.scss';

type ComponentProps = {
	color: string;
	text: string;
};

const GithubLabel: React.FC<ComponentProps> = props => {
	const { color, text } = props;

	return (
		<div className="ui-github-label" style={{ background: color, color: getContrastTextColor(color) }}>
			<Emoji text={text} />
		</div>
	);
};

export default React.memo(GithubLabel);
