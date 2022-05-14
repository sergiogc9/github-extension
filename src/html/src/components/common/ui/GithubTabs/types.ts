import { FlexProps } from '@sergiogc9/react-ui';

type Props = {
	defaultTab: string;
	onChangeTab?: (tabId: string) => void;
};

export type GithubTabsProps = FlexProps & Props;
