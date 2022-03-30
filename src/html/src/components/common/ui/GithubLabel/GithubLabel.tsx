import React from 'react';
import Emoji from 'react-emoji-render';

import { getContrastTextColor } from 'lib/color';

import { StyledGithubLabel } from './styled';
import { GithubLabelProps } from './types';

const GithubLabel: React.FC<GithubLabelProps> = props => {
	const { color, text, ...rest } = props;

	return (
		<StyledGithubLabel color={getContrastTextColor(color)} bg={color} {...rest}>
			<Emoji text={text} />
		</StyledGithubLabel>
	);
};

export default React.memo(GithubLabel);
