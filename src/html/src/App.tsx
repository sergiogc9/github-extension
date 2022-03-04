import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from '@sergiogc9/react-ui-theme';

import BrowserExtension from './components/Extension/BrowserExtension';

const App: React.FC = () => {
	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<BrowserExtension />
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
