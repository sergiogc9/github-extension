import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ReactUIProvider } from '@sergiogc9/react-ui-theme';

import { GlobalStyle, theme } from './theme';
import BrowserExtension from './components/Extension/BrowserExtension';

const App: React.FC = () => {
	return (
		<ReactUIProvider theme={theme}>
			<GlobalStyle />
			<BrowserRouter>
				<BrowserExtension />
			</BrowserRouter>
		</ReactUIProvider>
	);
};

export default App;
