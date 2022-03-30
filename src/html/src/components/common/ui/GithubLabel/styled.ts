import styled from 'styled-components';
import { Box } from '@sergiogc9/react-ui';

const StyledGithubLabel = styled(Box)``;

StyledGithubLabel.defaultProps = {
	alignItems: 'center',
	borderRadius: '2px',
	fontSize: '11px',
	fontWeight: 'bold',
	justifyContent: 'center',
	margin: '2px',
	paddingX: '3px',
	width: 'fit-content'
};

export { StyledGithubLabel };
