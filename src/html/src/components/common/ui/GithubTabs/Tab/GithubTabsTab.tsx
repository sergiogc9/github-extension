import React from 'react';

import { GithubTabsContext } from '../Context';
import { GithubTabsTabContext } from './Context';
import { StyledGithubTabsTab, StyledGithubTabsTabWrapper } from './styled';
import { GithubTabsTabProps } from './types';

const GithubTabsTab = React.memo((props: GithubTabsTabProps) => {
	const { children, id, ...rest } = props;

	const { onTabClicked, selectedTab } = React.useContext(GithubTabsContext);

	const isSelected = selectedTab === id;

	const tabContextData = React.useMemo(
		() => ({
			isSelected
		}),
		[isSelected]
	);

	return (
		<GithubTabsTabContext.Provider value={tabContextData}>
			<StyledGithubTabsTabWrapper isSelected={isSelected} onClick={() => onTabClicked(id)}>
				<StyledGithubTabsTab {...rest}>{children}</StyledGithubTabsTab>
			</StyledGithubTabsTabWrapper>
		</GithubTabsTabContext.Provider>
	);
});

export { GithubTabsTab };
