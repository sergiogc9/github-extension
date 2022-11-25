import React from 'react';
import keys from 'lodash/keys';
import { useTheme } from 'styled-components';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Box, Flex, Icon } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';

import { StyledTreeRow, StyledTreeRowText } from 'components/common/ui/Tree';
import PullRequestFile from 'components/PullRequest/File/PullRequestFile';
import { PullRequestFolder as PullRequestFolderType } from 'lib/Github/GithubTree';

type ComponentProps = {
	folder: PullRequestFolderType;
	deep: number;
};

const PullRequestFolder: React.FC<ComponentProps> = props => {
	const { folder, deep } = props;

	const [isOpened, setIsOpened] = React.useState(true);

	const theme = useTheme();

	const onToggleCollapsed = React.useCallback(() => setIsOpened(collapsed => !collapsed), []);

	const treeContent = React.useMemo(() => {
		return (
			<>
				{keys(folder.folders).map(folderName => (
					<PullRequestFolder key={folderName} folder={folder.folders[folderName]} deep={deep + 1} />
				))}
				{keys(folder.files).map(fileName => (
					<PullRequestFile
						key={fileName}
						file={folder.files[fileName]}
						deep={deep + 1}
						isFolderVisible={folder.matchesSearch}
					/>
				))}
			</>
		);
	}, [folder, deep]);

	const folderIconColor = getColorByMode(theme, { light: '#54aeff', dark: '#768390' });

	return (
		<Box>
			<StyledTreeRow
				deep={deep}
				isHighlighted={false}
				isVisible={folder.visible}
				onClick={onToggleCollapsed}
				title={folder.path}
			>
				<Flex columnGap={1} pl="2px" pr={1}>
					<Icon.FontAwesome
						color={folderIconColor}
						icon={isOpened ? solid('angle-down') : solid('angle-right')}
						size={10}
					/>
					<Icon.FontAwesome
						color={folderIconColor}
						icon={isOpened ? solid('folder-open') : solid('folder')}
						size={12}
					/>
				</Flex>
				<StyledTreeRowText fontWeight={folder.matchesSearch ? 'bold' : undefined}> {folder.name}</StyledTreeRowText>
			</StyledTreeRow>
			{isOpened && treeContent}
		</Box>
	);
};

export default React.memo(PullRequestFolder);
