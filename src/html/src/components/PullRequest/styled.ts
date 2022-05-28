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

const StyledPullRequestHeaderTitle = styled(Flex)``;

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

const StyledPullRequestHeaderBranch = styled(Flex)``;

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
`;

StyledPullRequestInfoElement.defaultProps = {
	alignItems: 'center',
	columnGap: 1,
	cursor: 'pointer',
	transition: 'transform ease-in 0.1s'
};

const StyledPullRequestInfo = styled(Flex)``;

StyledPullRequestInfo.defaultProps = {
	borderBottomStyle: 'solid',
	borderBottomWidth: 'thin',
	borderBottomColor: 'github.common.border',
	justifyContent: 'space-evenly',
	p: 2
};

export {
	StyledPullRequestHeader,
	StyledPullRequestHeaderBranch,
	StyledPullRequestHeaderLink,
	StyledPullRequestHeaderTitle,
	StyledPullRequestInfo,
	StyledPullRequestInfoElement
};
