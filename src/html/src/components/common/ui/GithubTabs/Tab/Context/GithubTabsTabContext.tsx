import React from 'react';

import { GithubTabsTabContextData } from './types';

const defaultContext = {
	isSelected: false
};

const GithubTabsTabContext = React.createContext<GithubTabsTabContextData>(defaultContext);

export { GithubTabsTabContext };
