import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { DefaultTheme } from 'styled-components';
import { ReactUIProvider } from '@sergiogc9/react-ui-theme';

import BrowserExtension from './components/Extension/BrowserExtension';

import { GlobalStyle, generateTheme, GithubThemeMode } from './theme';

const App: React.FC = () => {
	const [searchParams] = useSearchParams();

	const [theme, setTheme] = React.useState<DefaultTheme | null>(null);

	const githubThemeMode = searchParams.get('themeMode');
	React.useEffect(() => {
		(async () => {
			const themeMode = githubThemeMode as GithubThemeMode;
			setTheme(await generateTheme(themeMode));
		})();
	}, [githubThemeMode]);

	if (!theme) return null;

	return (
		<ReactUIProvider theme={theme}>
			<GlobalStyle />
			<BrowserExtension />
		</ReactUIProvider>
	);
};

export default App;
