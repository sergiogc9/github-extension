import styled from 'styled-components';
import { Flex } from '@sergiogc9/react-ui';

const StyledPullRequestReviewer = styled(Flex)`
	> img {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		margin-right: 5px;
	}
`;

StyledPullRequestReviewer.defaultProps = {
	alignItems: 'center',
	flexShrink: 0,
	justifyContent: 'flex-start',
	paddingY: 1
};

export { StyledPullRequestReviewer };
