import React from 'react';

import { GithubTabsContextData } from './types';

const defaultContext = {
	onTabClicked: () => {},
	selectedTab: ''
};

const GithubTabsContext = React.createContext<GithubTabsContextData>(defaultContext);

export { GithubTabsContext };
