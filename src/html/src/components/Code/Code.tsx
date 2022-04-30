import React from 'react';
import { useTheme } from 'styled-components';
import { Flex, Icon, Text } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import { usePageContext } from 'components/Extension/Context/PageContext';
import CodeTree from './Tree/CodeTree';

import { StyledCodeHeader, StyledCodeHeaderLink, StyledCodeHeaderTitle } from './styled';

const Code: React.FC = () => {
	const pageData = usePageContext()!;

	const theme = useTheme();

	const headerContent = React.useMemo(() => {
		const { user, repository } = pageData.data;
		return (
			<StyledCodeHeader>
				<StyledCodeHeaderTitle>
					<Icon.FontAwesome
						color={getColorByMode(theme, { light: 'neutral.600', dark: 'neutral.500' })}
						icon={solid('book-bookmark')}
						size={14}
					/>
					<StyledCodeHeaderLink href={`https://github.com/${user}`}>{user}</StyledCodeHeaderLink>
					<Text color={getColorByMode(theme, { light: 'neutral.600', dark: 'neutral.500' })}>/</Text>
					<StyledCodeHeaderLink fontWeight="bold" href={`hhttps://github.com/${user}/${repository}`}>
						{repository}
					</StyledCodeHeaderLink>
				</StyledCodeHeaderTitle>
				<Flex alignItems="center" bg="github.branch.bg" justifyContent="center" maxWidth="100%" p={1}>
					<Text
						aspectSize="xs"
						color="github.branch.text"
						lineHeight="10px"
						fontSize="10px"
						textOverflow="ellipsis"
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
