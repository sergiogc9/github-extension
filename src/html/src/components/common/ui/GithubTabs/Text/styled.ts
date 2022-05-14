import styled from 'styled-components';
import { Text } from '@sergiogc9/react-ui';

const StyledGithubTabsText = styled(Text)`
	&::before {
		content: attr(data-content);
		display: block;
		font-weight: 600;
		height: 0;
		visibility: hidden;
	}
`;

StyledGithubTabsText.defaultProps = {
	aspectSize: 's'
};

export { StyledGithubTabsText };
