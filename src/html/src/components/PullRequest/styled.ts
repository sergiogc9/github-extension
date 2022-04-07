import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Link } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';

const StyledPullRequestHeader = styled(Flex)`
	${props => css({ borderBottomColor: getColorByMode(props.theme, { light: 'neutral.100', dark: 'neutral.600' }) })}
`;

StyledPullRequestHeader.defaultProps = {
	alignItems: 'center',
	bg: 'github.sidebar.header',
	borderBottom: 'thin solid',
	flexDirection: 'column',
	flexShrink: 0,
	justifyContent: 'center',
	padding: 2,
	rowGap: 2
};

const StyledPullRequestHeaderTitle = styled(Flex)`
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

StyledPullRequestHeaderTitle.defaultProps = {
	alignItems: 'center',
	columnGap: 1,
	justifyContent: 'center',
	width: '100%'
};

const StyledPullRequestHeaderLink = styled(Link)`
	text-overflow: ellipsis;
	white-space: nowrap;
`;

StyledPullRequestHeaderLink.defaultProps = {
	aspectSize: 's',
	behavior: 'opposite',
	color: 'primary.500',
	overflow: 'hidden',
	target: '_blank',
	rel: 'noreferrer'
};

const StyledPullRequestHeaderBranch = styled(Flex)`
	> svg {
		color: $primaryColor;
		width: 13px;
		height: 13px;

		&:first-child {
			margin-left: 0;
		}

		&.fa-chevron-double-right {
			font-size: 8px;
		}
	}
`;

StyledPullRequestHeaderBranch.defaultProps = {
	alignItems: 'center',
	flexDirection: 'column',
	justifyContent: 'center',
	paddingX: 1,
	width: '100%'
};

export {
	StyledPullRequestHeader,
	StyledPullRequestHeaderBranch,
	StyledPullRequestHeaderLink,
	StyledPullRequestHeaderTitle
};
