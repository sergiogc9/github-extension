import React from 'react';
import keys from 'lodash/keys';
import { Collapse } from 'react-collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import FolderIcon from '../../common/FolderIcon';
import PullRequestFile from '../File/PullRequestFile';
import { PullRequestFolder as PullRequestFolderType } from '../../../lib/Github/GithubTree';

type ComponentProps = {
	folder: PullRequestFolderType
	deep: number
}

const PullRequestFolder: React.FC<ComponentProps> = props => {
	const { folder, deep } = props;

	const [isOpened, setIsOpened] = React.useState(true);

	const onToggleCollapsed = React.useCallback(() => setIsOpened(collapsed => !collapsed), []);

	const treeContent = React.useMemo(() => {
		return (
			<>
				{keys(folder.folders).map(folderName => <PullRequestFolder key={folderName} folder={folder.folders[folderName]} deep={deep + 1} />)}
				{keys(folder.files).map(fileName => <PullRequestFile key={fileName} file={folder.files[fileName]} deep={deep + 1} isFolderVisible={folder.matchesSearch} />)}
			</>
		);
	}, [folder, deep]);

	const styles = React.useMemo(() => ({ paddingLeft: `${deep * 10}px` }), [deep]);

	const hiddenClass = React.useMemo(() => folder.visible ? '' : 'hidden', [folder.visible]);
	const matchClass = React.useMemo(() => folder.matchesSearch ? 'search-match' : '', [folder.matchesSearch]);

	return (
		<div className={`github-extension-tree-folder ${hiddenClass}`}>
			<div className='github-extension-tree-folder-content' style={styles} onClick={onToggleCollapsed} title={folder.path}>
				<FontAwesomeIcon icon={isOpened ? "angle-down" : "angle-right"} color="dodgerblue" className='folder-collapse-icon' />
				<FolderIcon name={folder.name} opened={isOpened} />
				<span className={`folder-text ${matchClass}`}>  {folder.name}</span>
			</div>
			<Collapse isOpened={isOpened}>
				{treeContent}
			</Collapse>
		</div>
	);
};

export default React.memo(PullRequestFolder);
