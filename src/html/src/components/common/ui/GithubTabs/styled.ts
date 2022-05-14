import styled from 'styled-components';
import { Flex } from '@sergiogc9/react-ui';

const StyledGithubTabs = styled(Flex)``;

StyledGithubTabs.defaultProps = {
	bg: 'github.tab.bg',
	borderBottom: 'thin solid',
	borderBottomColor: 'github.common.border',
	columnGap: 2,
	px: 3
};

export { StyledGithubTabs };
