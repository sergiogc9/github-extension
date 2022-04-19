import styled from 'styled-components';
import { Box } from '@sergiogc9/react-ui';
import css from '@styled-system/css';

const StyledGithubInput = styled(Box)`
	&:focus-visible {
		${css({ outlineColor: 'primary.400' })}
	}
`;

StyledGithubInput.defaultProps = {
	as: 'input',
	bg: 'transparent',
	borderColor: 'neutral.600',
	borderRadius: 0,
	borderStyle: 'solid',
	borderWidth: 'thin',
	p: 2,
	width: '100%'
};

export { StyledGithubInput };
