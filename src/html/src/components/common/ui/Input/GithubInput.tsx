import React from 'react';

import { StyledGithubInput, StyledGithubWrapper } from './styled';
import { GithubInputProps } from './types';

const GithubInput: React.FC<GithubInputProps> = ({ inputProps, leftContent, rightContent, ...rest }) => {
	return (
		<StyledGithubWrapper {...rest}>
			{leftContent}
			<StyledGithubInput {...inputProps} />
			{rightContent}
		</StyledGithubWrapper>
	);
};

export default React.memo(GithubInput);
