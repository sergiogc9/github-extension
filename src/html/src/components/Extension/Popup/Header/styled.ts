import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Text } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';

import { FontAwesomeIcon } from 'components/common/Icon/Icon';

const StyledExtensionPopupHeader = styled(Flex)`
	${props =>
		css({
			borderBottomColor: getColorByMode(props.theme, { light: 'transparent', dark: 'github.common.border' })
		})}
`;

StyledExtensionPopupHeader.defaultProps = {
	alignItems: 'center',
	bg: 'github.popup.header',
	borderBottomStyle: 'solid',
	borderBottomWidth: 'thin',
	height: 50,
	flexShrink: 0,
	padding: '0 14px',
	width: '100%'
};

const StyledGithubIcon = styled(FontAwesomeIcon)`
	${css({
		color: 'neutral.0',
		height: 26,
		marginRight: 3,
		width: 26
	})}
`;

const StyledTabLink = styled(Text)`
	${css({
		transition: 'color ease-in-out 0.15s',
		'&:hover': {
			color: 'neutral.300'
		}
	})}
`;

StyledTabLink.defaultProps = {
	aspectSize: 's',
	color: 'neutral.0',
	cursor: 'pointer',
	fontWeight: 'bold'
};

export { StyledExtensionPopupHeader, StyledGithubIcon, StyledTabLink };
