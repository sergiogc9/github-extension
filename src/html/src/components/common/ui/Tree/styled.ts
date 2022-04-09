import styled from 'styled-components';
import css from '@styled-system/css';
import { Box, Flex, Text } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';

const StyledTree = styled(Box)<{ isPullRequest?: boolean }>`
	${props =>
		props.isPullRequest &&
		css({
			borderBottomStyle: 'solid',
			borderBottomWidth: 'thin',
			borderTopStyle: 'solid',
			borderTopWidth: 'thin',
			borderBottomColor: 'github.common.border',
			borderTopColor: 'github.common.border'
		})}
`;

StyledTree.defaultProps = {
	flexGrow: 1,
	overflowY: 'auto',
	position: 'relative'
};

// TODO! REMOVE THIS
const collapseIconWidth = '12px';
const iconWidth = '20px';
const iconFontSize = '12px';

const StyledTreeRow = styled(Flex)<{ deep: number; isVisible: boolean }>`
	${props => !props.isVisible && `display: none;`}

	padding-left: ${props => props.deep * 10}px;

	&:hover {
		${props => css({ bg: getColorByMode(props.theme, { light: 'primary.50', dark: 'github.common.bgHover' }) })}

		span {
			${props => css({ color: getColorByMode(props.theme, { light: 'primary.600', dark: 'common.text' }) })}
		}
	}

	// TODO! Remove this
	.folder-collapse-icon {
		color: rgba(3, 47, 98, 0.5);
		width: ${collapseIconWidth};
		height: ${collapseIconWidth};
		user-select: none;
	}

	.folder-icon,
	.file-icon {
		font-size: ${iconFontSize};
		font-style: normal;
		width: ${iconWidth};
		user-select: none;

		&.react-icon {
			padding: 3px 0;
			height: ${iconWidth};
			transform: translateX(-1px);
		}
	}

	i.folder-icon,
	i.file-icon {
		&::before {
			font-size: ${iconFontSize};
			width: ${iconWidth};
			display: flex;
			justify-content: center;
		}
	}

	.folder-icon {
		&.default {
			filter: invert(43%) sepia(82%) saturate(2523%) hue-rotate(194deg) brightness(103%) contrast(105%);
		}
	}

	.file-icon {
		margin-left: ${collapseIconWidth};
	}

	img.folder-icon,
	img.file-icon {
		padding: 2px 4px;
		padding-left: 1px;
	}
`;

StyledTreeRow.defaultProps = {
	alignItems: 'center',
	cursor: 'pointer',
	height: 20,
	width: '100%'
};

const StyledTreeRowText = styled(Text)``;

StyledTreeRowText.defaultProps = {
	aspectSize: 'xs',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap'
};

export { StyledTree, StyledTreeRow, StyledTreeRowText };
