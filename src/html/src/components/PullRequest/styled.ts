import styled from 'styled-components';
import { Flex, Link } from '@sergiogc9/react-ui';

const StyledPullRequestHeader = styled(Flex)``;

StyledPullRequestHeader.defaultProps = {
	alignItems: 'center',
	bg: 'github.sidebar.header',
	borderBottom: 'thin solid',
	borderBottomColor: 'github.common.border',
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

const StyledPullRequestInfoElement = styled(Flex)`
	&:hover {
		transform: scale(1.2);
	}

	> svg {
		width: 14px;
		height: 14px;
		margin-right: 3px;
	}
	> span {
		font-size: 11px;
		line-height: 15px;
		&.text-small {
			font-size: 9px;
		}
	}

	&.info-additions {
		svg {
			color: green;
			width: 6px;
		}
	}
	&.info-deletions {
		svg {
			color: red;
			width: 6px;
		}
	}
`;

StyledPullRequestInfoElement.defaultProps = {
	alignItems: 'center',
	cursor: 'pointer',
	transition: 'transform ease-in 0.1s'
};

export {
	StyledPullRequestHeader,
	StyledPullRequestHeaderBranch,
	StyledPullRequestHeaderLink,
	StyledPullRequestHeaderTitle,
	StyledPullRequestInfoElement
};
