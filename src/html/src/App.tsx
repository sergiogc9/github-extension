import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';

import BrowserExtension from './components/Extension/BrowserExtension';

const history = createBrowserHistory();

const App: React.FC = () => {
	return (
		<Router history={history}>
			<BrowserExtension />
		</Router>
	);
};

export default App;
