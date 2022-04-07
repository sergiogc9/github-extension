import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';

const StyledExtensionSidebar = styled(Flex)`
	${props =>
		css({
			borderRightColor: getColorByMode(props.theme, { light: 'neutral.200', dark: 'neutral.600' })
		})}
`;

StyledExtensionSidebar.defaultProps = {
	bg: 'common.background',
	borderRightStyle: 'solid',
	borderRightWidth: 'thin',
	flexDirection: 'column',
	height: '100%',
	justifyContent: 'space-between',
	overflow: 'hidden',
	width: '100%'
};

const StyledExtensionSidebarToolbar = styled(Flex)`
	${props =>
		css({
			borderTopColor: getColorByMode(props.theme, { light: 'neutral.200', dark: 'neutral.600' })
		})}
`;

StyledExtensionSidebarToolbar.defaultProps = {
	alignItems: 'center',
	bg: 'github.sidebar.toolbar',
	borderTopStyle: 'solid',
	borderTopWidth: 'thin',
	minHeight: 30,
	justifyContent: 'space-between',
	py: 1
};

const StyledExtensionSidebarToolbarIconWrapper = styled(Flex)<{ isSelected: boolean }>`
	${props =>
		css({
			color: getColorByMode(props.theme, { light: 'common.text', dark: 'neutral.200' }),
			cursor: 'pointer',
			transition: 'color ease-in-out 0.2s',
			'&:hover': {
				color: getColorByMode(props.theme, { light: 'primary.500', dark: 'primary.300' })
			}
		})}

	${props =>
		props.isSelected &&
		css({
			color: getColorByMode(props.theme, { light: 'primary.500', dark: 'primary.300' })
		})}

	& > svg {
		color: currentColor;
		height: 100%;
		width: 100%;
	}
`;

StyledExtensionSidebarToolbarIconWrapper.defaultProps = {
	cursor: 'pointer',
	flexShrink: 0,
	ml: 1,
	mr: 1,
	size: 12
};

export { StyledExtensionSidebar, StyledExtensionSidebarToolbar, StyledExtensionSidebarToolbarIconWrapper };
