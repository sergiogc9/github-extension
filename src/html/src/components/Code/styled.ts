import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Link } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';

const StyledCodeHeader = styled(Flex)`
	${props => css({ borderBottomColor: getColorByMode(props.theme, { light: 'neutral.100', dark: 'neutral.600' }) })}
`;

StyledCodeHeader.defaultProps = {
	alignItems: 'center',
	bg: 'github.sidebar.header',
	borderBottom: 'thin solid',
	flexDirection: 'column',
	flexShrink: 0,
	justifyContent: 'center',
	minHeight: 50,
	padding: 2,
	rowGap: 2
};

const StyledCodeHeaderTitle = styled(Flex)`
	> svg {
		flex-shrink: 0;
		&:first-child {
			margin-left: 0;
			width: 16px;
			height: 16px;
		}

		&.fa-chevron-double-right-solid {
			width: 8px;
			height: 8px;
		}
	}
`;

StyledCodeHeaderTitle.defaultProps = {
	alignItems: 'center',
	columnGap: 1,
	justifyContent: 'center',
	width: '100%'
};

const StyledCodeHeaderLink = styled(Link)`
	text-overflow: ellipsis;
	white-space: nowrap;
`;

StyledCodeHeaderLink.defaultProps = {
	aspectSize: 's',
	behavior: 'opposite',
	color: 'primary.500',
	overflow: 'hidden',
	target: '_blank',
	rel: 'noreferrer'
};

export { StyledCodeHeader, StyledCodeHeaderLink, StyledCodeHeaderTitle };
