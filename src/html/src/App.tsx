import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from 'styled-components';
import theme from '@sergiogc9/react-ui-theme';

import BrowserExtension from './components/Extension/BrowserExtension';

const history = createBrowserHistory();

const App: React.FC = () => {
	return (
		<ThemeProvider theme={theme}>
			<Router history={history}>
				<BrowserExtension />
			</Router>
		</ThemeProvider>
	);
};

export default App;
