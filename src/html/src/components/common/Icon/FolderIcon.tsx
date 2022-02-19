import React from 'react';
import { getIconForFolder, getIconForOpenFolder } from 'vscode-material-icon-theme-js';

type ComponentProps = {
	name: string;
	opened: boolean;
};

const FolderIcon: React.FC<ComponentProps> = props => {
	const { name, opened } = props;

	// Disabled custom folders, name should be used instead. Maybe enable in dark mode?
	const svgFile = opened ? getIconForOpenFolder('') : getIconForFolder('');
	const isDefault = svgFile === 'folder.svg' || svgFile === 'folder-open.svg';
	return <img className={`folder-icon ${isDefault ? 'default' : ''}`} src={`file-icons/${svgFile}`} alt={name} />;
};

export default React.memo(FolderIcon);
