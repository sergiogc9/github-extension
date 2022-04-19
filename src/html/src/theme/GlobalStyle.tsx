import { createGlobalStyle } from 'styled-components';
import { reset } from '@sergiogc9/react-ui-theme';

const GlobalStyle = createGlobalStyle`
	${reset}

	#root, html, body {
		height: 100%;
	}
`;

export { GlobalStyle };
