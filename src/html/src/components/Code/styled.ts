import styled from 'styled-components';
import { Flex, Link } from '@sergiogc9/react-ui';

const StyledCodeHeader = styled(Flex)``;

StyledCodeHeader.defaultProps = {
	alignItems: 'center',
	bg: 'github.sidebar.header',
	borderBottom: 'thin solid',
	borderBottomColor: 'github.common.border',
	flexDirection: 'column',
	flexShrink: 0,
	justifyContent: 'center',
	minHeight: 50,
	padding: 2,
	rowGap: 2
};

const StyledCodeHeaderTitle = styled(Flex)``;

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
