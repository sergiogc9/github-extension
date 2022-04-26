import styled from 'styled-components';
import css from '@styled-system/css';
import { Animation, Flex, Text, TextProps } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';
import React from 'react';

const StyledExtensionPopupPullRequests = styled(Flex)``;

StyledExtensionPopupPullRequests.defaultProps = {
	bg: 'common.background',
	display: 'block',
	overflowY: 'auto',
	position: 'relative'
};

const StyledLoader = styled(Animation.FadeIn)``;

StyledLoader.defaultProps = {
	alignItems: 'center',
	borderRadius: '50%',
	bg: 'primary.500',
	bottom: '10px',
	height: 30,
	justifyContent: 'center',
	left: 'calc(50% - 15px)',
	position: 'fixed',
	width: 30,
	zIndex: 10
};

const StyledPullRequest = styled(Flex)`
	${css({
		transition: 'background-color ease-in-out 0.15s',
		'&:hover': {
			bg: 'github.common.bgHover'
		}
	})}
`;

StyledPullRequest.defaultProps = {
	alignItems: 'center',
	borderBottomStyle: 'solid',
	borderBottomWidth: 'thin',
	borderBottomColor: 'github.common.border',
	minHeight: 75,
	paddingY: '5px'
};

const StyledPullRequestStatusContentWrapper = styled(Flex)``;

StyledPullRequestStatusContentWrapper.defaultProps = {
	flexShrink: 0,
	marginX: 1
};

const StyledHoveredText: React.FC<TextProps<React.AnchorHTMLAttributes<HTMLAnchorElement>>> = styled(Text)`
	${props =>
		css({
			cursor: 'pointer',
			transition: 'color ease-in-out 0.25s',
			'&:hover': {
				color: getColorByMode(props.theme, { light: 'primary.500', dark: 'primary.300' })
			}
		})}
`;

const StyledPullRequestChange = styled(Flex)``;

StyledPullRequestChange.defaultProps = {
	alignItems: 'center',
	bg: 'primary.500',
	borderRadius: '10%',
	color: 'neutral.0',
	columnGap: 1,
	fontSize: '12px',
	justifyContent: 'center',
	marginRight: 1,
	minHeight: 20,
	minWidth: 36,
	paddingX: '6px'
};

const StyledPullRequestChangeText = styled(Text)``;

StyledPullRequestChangeText.defaultProps = {
	fontSize: '11px',
	fontWeight: 'bold',
	lineHeight: '20px'
};

export {
	StyledExtensionPopupPullRequests,
	StyledHoveredText,
	StyledLoader,
	StyledPullRequest,
	StyledPullRequestChange,
	StyledPullRequestChangeText,
	StyledPullRequestStatusContentWrapper
};
