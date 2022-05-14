import React from 'react';

import { GithubTabsContext } from './Context';
import { StyledGithubTabs } from './styled';
import { GithubTabsProps } from './types';

const GithubTabs = React.memo((props: GithubTabsProps) => {
	const { children, defaultTab, onChangeTab, ...rest } = props;

	const [selectedTab, setSelectedTab] = React.useState(defaultTab);
	const contextValues = React.useMemo(
		() => ({
			onTabClicked: (id: string) => {
				setSelectedTab(id);
				if (onChangeTab) onChangeTab(id);
			},
			selectedTab
		}),
		[onChangeTab, selectedTab]
	);

	return (
		<GithubTabsContext.Provider value={contextValues}>
			<StyledGithubTabs {...rest}>{children}</StyledGithubTabs>
		</GithubTabsContext.Provider>
	);
});

export { GithubTabs };
