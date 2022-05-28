import styled from 'styled-components';
import css from '@styled-system/css';
import { Box, Flex, Text } from '@sergiogc9/react-ui';

const StyledTree = styled(Box)<{ isPullRequest?: boolean }>`
	${props =>
		props.isPullRequest &&
		css({
			borderBottomStyle: 'solid',
			borderBottomWidth: 'thin',
			borderBottomColor: 'github.common.border'
		})}
`;

StyledTree.defaultProps = {
	flexGrow: 1,
	overflowY: 'auto',
	position: 'relative'
};

const collapseIconWidth = '12px';
const iconWidth = '20px';
const iconFontSize = '12px';

const StyledTreeRow = styled(Flex)<{ deep: number; isHighlighted: boolean; isVisible: boolean }>`
	${props => !props.isVisible && `display: none;`}
	${props => props.isHighlighted && css({ bg: 'github.common.bgHover' })}

	padding-left: ${props => props.deep * 10}px;

	&:hover {
		${css({ bg: 'github.common.bgHover' })}

		span {
			${css({ color: 'common.text' })}
		}
	}

	.file-icon {
		font-size: ${iconFontSize};
		font-style: normal;
		margin-left: ${collapseIconWidth};
		user-select: none;
		width: ${iconWidth};
	}

	i.file-icon {
		&::before {
			font-size: ${iconFontSize};
			width: ${iconWidth};
			display: flex;
			justify-content: center;
		}
	}

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
