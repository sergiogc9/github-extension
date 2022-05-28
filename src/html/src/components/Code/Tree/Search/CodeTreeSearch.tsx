import React from 'react';
import { Box, Flex, Icon } from '@sergiogc9/react-ui';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import { useSearchContext } from 'components/Extension/Context/SearchContext';
import GithubInput from 'components/common/ui/Input/GithubInput';

import { CodeTreeSearchProps } from './types';

const CodeTreeSearch = (props: CodeTreeSearchProps) => {
	const { clearSearchValue, onChangeSearchValue, inputValue, searchValue } = useSearchContext();

	return (
		<Flex p={1} position="relative" {...props}>
			<GithubInput
				fontSize="12px"
				height={24}
				inputProps={{
					onChange: onChangeSearchValue,
					placeholder: 'Filter files',
					value: inputValue
				}}
				leftContent={<Icon.FontAwesome aspectSize="xs" color="neutral.500" icon={solid('search')} />}
				py={0}
				pr={3}
				rightContent={
					<Box
						cursor={searchValue.length ? 'pointer' : 'unset'}
						onClick={clearSearchValue}
						opacity={searchValue.length ? 1 : 0}
						transition="opacity ease-in-out 0.25s"
					>
						<Icon.FontAwesome aspectSize="xs" color="neutral.500" icon={solid('times')} />
					</Box>
				}
			/>
		</Flex>
	);
};

export default React.memo(CodeTreeSearch);
