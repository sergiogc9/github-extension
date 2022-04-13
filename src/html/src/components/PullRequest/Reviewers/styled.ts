import styled from 'styled-components';
import { Flex } from '@sergiogc9/react-ui';

const StyledPullRequestReviewer = styled(Flex)`
	> img {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		margin-right: 5px;
	}

	> svg {
		flex-shrink: 0;
		width: 14px;
		height: 14px;

		&.mui-check {
			color: green;
		}
		&.fa-times-light {
			color: red;
			margin-top: 2px;
		}
		&.nc-a-chat-solid {
			width: 12px;
			height: 12px;
			margin-top: 2px;
			color: black;
		}
	}
`;

StyledPullRequestReviewer.defaultProps = {
	alignItems: 'center',
	flexShrink: 0,
	justifyContent: 'flex-start',
	paddingY: 1
};

export { StyledPullRequestReviewer };
