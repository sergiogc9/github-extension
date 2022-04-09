import React from 'react';
import { useTheme } from 'styled-components';
import { Flex, Text } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';

import { FontAwesomeIcon, MaterialUIIcon } from 'components/common/Icon/Icon';
import { PageContext } from 'components/Extension/Context/PageContext';
import CodeTree from './Tree/CodeTree';

import { StyledCodeHeader, StyledCodeHeaderLink, StyledCodeHeaderTitle } from './styled';

const Code: React.FC = () => {
	const pageData = React.useContext(PageContext)!;

	const theme = useTheme();

	const headerContent = React.useMemo(() => {
		const { user, repository } = pageData.data;
		return (
			<StyledCodeHeader>
				<StyledCodeHeaderTitle>
					<MaterialUIIcon name="library-books" />
					<StyledCodeHeaderLink href={`https://github.com/${user}`}>{user}</StyledCodeHeaderLink>
					<FontAwesomeIcon name="chevron-double-right" type="solid" />
					<StyledCodeHeaderLink fontWeight="bold" href={`hhttps://github.com/${user}/${repository}`}>
						{repository}
					</StyledCodeHeaderLink>
				</StyledCodeHeaderTitle>
				<Flex
					alignItems="center"
					bg={getColorByMode(theme, { light: 'primary.100', dark: 'neutral.700' })}
					justifyContent="center"
					maxWidth="100%"
					p={1}
				>
					<Text
						aspectSize="xs"
						color={getColorByMode(theme, { light: 'primary.800', dark: 'primary.400' })}
						lineHeight="10px"
						fontSize="10px"
						// TODO! uncomment this once it is available on Text component
						// textOverflow="ellipsis"
						overflow="hidden"
						whiteSpace="nowrap"
						width="100%"
					>
						{pageData.data.tree}
					</Text>
				</Flex>
			</StyledCodeHeader>
		);
	}, [pageData.data, theme]);

	return (
		<Flex flexDirection="column" flexGrow={1} overflow="hidden">
			{headerContent}
			<CodeTree />
		</Flex>
	);
};

export default React.memo(Code);
