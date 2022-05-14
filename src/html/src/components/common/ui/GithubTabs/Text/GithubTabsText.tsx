import React from 'react';

import { GithubTabsTabContext } from '../Tab/Context';
import { StyledGithubTabsText } from './styled';
import { GithubTabsTextProps } from './types';

const GithubTabsText = React.memo((props: GithubTabsTextProps) => {
	const { children, ...rest } = props;

	const { isSelected } = React.useContext(GithubTabsTabContext);

	return (
		<StyledGithubTabsText data-content={children} fontWeight={isSelected ? '600' : undefined} {...rest}>
			{children}
		</StyledGithubTabsText>
	);
});

export { GithubTabsText };
