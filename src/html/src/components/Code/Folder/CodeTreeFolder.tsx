import React from 'react';
import keys from 'lodash/keys';
import { Collapse } from 'react-collapse';

import CodeTreeFile from 'components/Code/File/CodeTreeFile';
import FolderIcon from 'components/common/Icon/FolderIcon';
import { FontAwesomeIcon } from 'components/common/Icon/Icon';
import { FolderPlaceholder } from 'components/common/Placeholder';
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

	const styles = React.useMemo(() => ({ paddingLeft: `${deep * 10}px` }), [deep]);
	const hiddenClass = React.useMemo(() => (folder.visible ? '' : 'hidden'), [folder.visible]);
	const matchClass = React.useMemo(() => (folder.matchesSearch ? 'search-match' : ''), [folder.matchesSearch]);

	const treeContent = React.useMemo(() => {
		if (isOpened && !folder.loaded)
			return (
				<div style={{ paddingLeft: `${(deep + 2) * 10}px` }}>
					<FolderPlaceholder />
				</div>
			);
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
		<div className={`github-extension-tree-folder ${hiddenClass}`}>
			<div
				className="github-extension-tree-folder-content"
				style={styles}
				onClick={onToggleCollapsed}
				title={folder.path}
			>
				<FontAwesomeIcon
					name={isOpened ? 'angle-down' : 'angle-right'}
					type="solid"
					color="dodgerblue"
					className="folder-collapse-icon"
				/>
				<FolderIcon name={folder.name} opened={isOpened} />
				<span className={`folder-text ${matchClass}`}> {folder.name}</span>
			</div>
			<Collapse isOpened={isOpened}>{treeContent}</Collapse>
		</div>
	);
};

export default React.memo(CodeTreeFolder);
