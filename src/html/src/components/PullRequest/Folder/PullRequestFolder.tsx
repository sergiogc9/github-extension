import React from 'react';
import keys from 'lodash/keys';
import { Collapse } from 'react-collapse';
import { Box } from '@sergiogc9/react-ui';

import { StyledTreeRow, StyledTreeRowText } from 'components/common/ui/Tree';
import FolderIcon from 'components/common/Icon/FolderIcon';
import PullRequestFile from 'components/PullRequest/File/PullRequestFile';
import { PullRequestFolder as PullRequestFolderType } from 'lib/Github/GithubTree';
import { FontAwesomeIcon } from 'components/common/Icon/Icon';

type ComponentProps = {
	folder: PullRequestFolderType;
	deep: number;
};

const PullRequestFolder: React.FC<ComponentProps> = props => {
	const { folder, deep } = props;

	const [isOpened, setIsOpened] = React.useState(true);

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

export default React.memo(PullRequestFolder);
