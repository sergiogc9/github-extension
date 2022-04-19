import React from 'react';
import values from 'lodash/values';
import isEmpty from 'lodash/isEmpty';
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Box, Flex, Icon, Status, Text } from '@sergiogc9/react-ui';

import { GithubReviews } from 'types/Github';

import { StyledPullRequestReviewer } from './styled';

type ComponentProps = { reviews?: GithubReviews };

const PullRequestReviewers: React.FC<ComponentProps> = props => {
	const { reviews } = props;

	const content = React.useMemo(() => {
		if (isEmpty(reviews))
			return (
				<Flex justifyContent="center">
					<Text aspectSize="xs" fontSize="9px" lineHeight="9px">
						NO REVIEWS AVAILABLE
					</Text>
				</Flex>
			);

		return values(reviews).map(review => {
			let icon;
			if (review.state === 'APPROVED') icon = <Icon.FontAwesome color="green.700" icon={solid('check')} size={12} />;
			else if (review.state === 'CHANGES_REQUESTED')
				icon = <Icon.FontAwesome color="red.600" icon={solid('xmark')} size={12} />;
			else if (review.state === 'COMMENTED')
				icon = <Icon.FontAwesome color="neutral.800" icon={regular('message')} size={12} pt="2px" />;
			else icon = <Status flexShrink={0} mr={1} size={9} variant="yellow" />;

			return (
				<StyledPullRequestReviewer key={review.user}>
					<img src={`${review.userImgUrl}&s=20`} alt="" />
					<Text
						aspectSize="xs"
						fontSize="11px"
						fontWeight="bold"
						lineHeight="11px"
						mr={1}
						overflow="hidden"
						textOverflow="ellipsis"
						whiteSpace="nowrap"
					>
						{review.user}
					</Text>
					{icon}
				</StyledPullRequestReviewer>
			);
		});
	}, [reviews]);

	return <Box width="50%">{content}</Box>;
};

export default React.memo(PullRequestReviewers);
