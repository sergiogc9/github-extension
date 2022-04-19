import React from 'react';

import { StyledGithubInput } from './styled';
import { GithubInputProps } from './types';

const GithubInput: React.FC<GithubInputProps> = props => {
	return <StyledGithubInput {...props} />;
};

export default React.memo(GithubInput);
