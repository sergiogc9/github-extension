import styled, { css } from 'styled-components';
import systemCSS from '@styled-system/css';
import { Flex } from '@sergiogc9/react-ui';

import { StyledGithubTabsTabProps } from './types';

const StyledGithubTabsTabWrapper = styled(Flex)<StyledGithubTabsTabProps>`
	&:hover {
		> div {
			${systemCSS({
				bg: 'github.tab.bgHover'
			})}
		}
	}

	${props =>
		css`
			&::after {
				content: '';
				${systemCSS({
					bg: props.isSelected ? 'github.tab.bottomLine' : 'transparent',
					bottom: 0,
					height: 2,
					position: 'absolute',
					transition: 'background-color ease-in-out 0.15s',
					width: '100%'
				})}
			}
		`}
`;

StyledGithubTabsTabWrapper.defaultProps = {
	cursor: 'pointer',
	position: 'relative',
	py: 2
};

const StyledGithubTabsTab = styled(Flex)``;

StyledGithubTabsTab.defaultProps = {
	alignItems: 'center',
	borderRadius: 1,
	columnGap: 1,
	height: 30,
	px: 2,
	transition: 'background-color ease-in-out 0.15s'
};

export { StyledGithubTabsTab, StyledGithubTabsTabWrapper };
