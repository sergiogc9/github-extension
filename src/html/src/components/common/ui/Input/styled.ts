import styled from 'styled-components';
import { Box, Flex } from '@sergiogc9/react-ui';
import css from '@styled-system/css';

import { StyledGithubInputProps } from './types';

const StyledGithubInput = styled(Box)<StyledGithubInputProps>``;

StyledGithubInput.defaultProps = {
	as: 'input',
	bg: 'transparent',
	borderWidth: 0,
	color: 'common.text',
	outline: 'none',
	height: '100%',
	width: '100%'
};

const StyledGithubWrapper = styled(Flex)`
	&:hover {
		${css({ borderColor: 'neutral.600' })}
	}

	&:focus-within {
		${css({ borderColor: 'primary.500' })}
	}
`;

StyledGithubWrapper.defaultProps = {
	alignItems: 'center',
	bg: 'transparent',
	borderColor: 'github.common.border',
	borderRadius: 0,
	borderStyle: 'solid',
	borderWidth: 'thin',
	columnGap: 1,
	px: 2,
	transition: 'border-color ease-in-out 0.25s',
	width: '100%'
};

export { StyledGithubInput, StyledGithubWrapper };
