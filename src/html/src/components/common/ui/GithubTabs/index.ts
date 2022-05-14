import { createNameSpacedComponent } from '@sergiogc9/react-utils';

import { GithubTabs as GithubTabsBase } from './GithubTabs';
import { GithubTabsTab, GithubTabsTabProps } from './Tab';
import { GithubTabsText, GithubTabsTextProps } from './Text';
import { GithubTabsProps } from './types';

const GithubTabs = createNameSpacedComponent(GithubTabsBase, {
	Tab: GithubTabsTab,
	Text: GithubTabsText
});

export { GithubTabs };
export type { GithubTabsProps, GithubTabsTabProps, GithubTabsTextProps };
