import styled from 'styled-components';
import css from '@styled-system/css';
import { Icon } from '@sergiogc9/react-ui';
import { ActionMenu } from '@sergiogc9/react-ui-collections';
import { getColorFromTheme } from '@sergiogc9/react-ui-theme';

const StyledActionMenu = styled(ActionMenu)`
	${props =>
		css({
			borderColor: getColorFromTheme(props.theme, 'github.common.border'),
			borderRadius: 0
		})}
`;

const StyledActionMenuItem = styled(ActionMenu.Item)`
	${css({
		lineHeight: '16px',
		minHeight: 24,
		py: 2
	})}
`;

StyledActionMenuItem.defaultProps = {
	aspectSize: 'xs'
};

const StyledFontAwesomeIcon = styled(Icon.FontAwesome)`
	&:hover {
		${css({
			color: 'blue.500'
		})}
	}

	transition: color ease-in-out 0.15s;
`;

StyledFontAwesomeIcon.defaultProps = {
	color: 'neutral.400',
	cursor: 'pointer'
};

export { StyledActionMenu, StyledActionMenuItem, StyledFontAwesomeIcon };
