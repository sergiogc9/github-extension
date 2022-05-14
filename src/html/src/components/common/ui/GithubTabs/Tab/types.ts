import { FlexProps } from '@sergiogc9/react-ui';

type Props = {
	id: string;
};

export type GithubTabsTabProps = FlexProps & Props;

type StyledGithubTabsTabProps = FlexProps & {
	isSelected: boolean;
};

export type { StyledGithubTabsTabProps };
