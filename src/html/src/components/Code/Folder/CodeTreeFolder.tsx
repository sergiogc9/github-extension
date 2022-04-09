import React from 'react';
import keys from 'lodash/keys';
import { Collapse } from 'react-collapse';
import { Box } from '@sergiogc9/react-ui';

import { StyledTreeRow, StyledTreeRowText, TreeFolderSkeleton } from 'components/common/ui/Tree';
import CodeTreeFile from 'components/Code/File/CodeTreeFile';
import FolderIcon from 'components/common/Icon/FolderIcon';
import { FontAwesomeIcon } from 'components/common/Icon/Icon';
import { CodeTreeFolder as CodeTreeFolderType } from 'lib/Github/GithubTree';

type ComponentProps = {
	folder: CodeTreeFolderType;
	deep: number;
	onLoadFolder: (path: string, sha: string) => void;
};

const CodeTreeFolder: React.FC<ComponentProps> = props => {
	const { folder, deep } = props;
	const { onLoadFolder } = props;

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

	return (
		<Box>
			<StyledTreeRow deep={deep} isVisible={folder.visible} onClick={onToggleCollapsed} title={folder.path}>
				<FontAwesomeIcon
					name={isOpened ? 'angle-down' : 'angle-right'}
					type="solid"
					color="dodgerblue"
					className="folder-collapse-icon"
				/>
				<FolderIcon name={folder.name} opened={isOpened} />
				<StyledTreeRowText fontWeight={folder.matchesSearch ? 'bold' : undefined}> {folder.name}</StyledTreeRowText>
			</StyledTreeRow>
			<Collapse isOpened={isOpened}>{treeContent}</Collapse>
		</Box>
	);
};

export default React.memo(CodeTreeFolder);
