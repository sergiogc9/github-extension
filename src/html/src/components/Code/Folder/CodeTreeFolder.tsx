import React from 'react';
import { useTheme } from 'styled-components';
import keys from 'lodash/keys';
import { Collapse } from 'react-collapse';
import { Box, Flex, Icon } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import { StyledTreeRow, StyledTreeRowText, TreeFolderSkeleton } from 'components/common/ui/Tree';
import CodeTreeFile from 'components/Code/File/CodeTreeFile';
import { CodeTreeFolder as CodeTreeFolderType } from 'lib/Github/GithubTree';

type ComponentProps = {
	folder: CodeTreeFolderType;
	deep: number;
	onLoadFolder: (path: string, sha: string) => void;
};

const CodeTreeFolder: React.FC<ComponentProps> = props => {
	const { folder, deep } = props;
	const { onLoadFolder } = props;

	const theme = useTheme();

	const [isOpened, setIsOpened] = React.useState(false);

	const onToggleCollapsed = React.useCallback(() => {
		if (!folder.loaded) onLoadFolder(`${folder.path}/`, folder.sha);
		setIsOpened(collapsed => !collapsed);
	}, [folder.path, folder.sha, folder.loaded, onLoadFolder]);

	const treeContent = React.useMemo(() => {
		if (isOpened && !folder.loaded) return <TreeFolderSkeleton deep={deep} />;

		return (
			<>
				{keys(folder.folders).map(folderName => (
					<CodeTreeFolder
						key={folderName}
						folder={folder.folders[folderName]}
						deep={deep + 1}
						onLoadFolder={onLoadFolder}
					/>
				))}
				{keys(folder.files).map(fileName => (
					<CodeTreeFile
						key={fileName}
						file={folder.files[fileName]}
						deep={deep + 1}
						isFolderVisible={folder.matchesSearch}
					/>
				))}
			</>
		);
	}, [isOpened, folder, deep, onLoadFolder]);

	const folderIconColor = getColorByMode(theme, { light: '#54aeff', dark: '#768390' });

	return (
		<Box>
			<StyledTreeRow deep={deep} isVisible={folder.visible} onClick={onToggleCollapsed} title={folder.path}>
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
				<StyledTreeRowText fontWeight={folder.matchesSearch ? 'bold' : undefined}>{folder.name}</StyledTreeRowText>
			</StyledTreeRow>
			<Collapse isOpened={isOpened}>{treeContent}</Collapse>
		</Box>
	);
};

export default React.memo(CodeTreeFolder);
