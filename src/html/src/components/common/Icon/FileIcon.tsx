import React from 'react';
import FileIconsLibrary from 'file-icons-js';
import { getIconForFile } from 'vscode-material-icon-theme-js';
import { FontAwesomeIcon } from './Icon';

type ComponentProps = {
	filename: string
}

/* Forced icons to use vscode icons set
Options:
One extension: tsx -> matches name.tsx but not name.test.tsx
Two extensions, exact: test.tsx -> matches file.test.tsx
Two extensions, second extension wildcard: test.* -> matches test.tsx, test.ts, test.snap, etc...
Two extensions, first extension wildcard: *.js -> matches map.js, test.js etc... but not matches file.js
Full file name: package-json.lock
*/
const vscodeIcons: Record<string, true> = {
	'tsx': true,
	'test.*': true,
	'*.snap': true,
	'scss': true,
	'.gitignore': true,
	'md': true,
	'package-json.lock': true,
	'package.json': true,
	'gulpfile.js': true
};

const FileIcon: React.FC<ComponentProps> = props => {
	const { filename } = props;

	let forceVSCodeIcon = false;

	const extensions = filename.split('.');
	if (extensions.length > 2) {
		const ext1 = extensions.pop();
		const ext2 = extensions.pop();
		forceVSCodeIcon = vscodeIcons[`${ext2}.${ext1}`] || vscodeIcons[`${ext2}.*`] || vscodeIcons[`*.${ext1}`];
	}
	else forceVSCodeIcon = vscodeIcons[extensions.pop() || ""];
	forceVSCodeIcon = forceVSCodeIcon || vscodeIcons[filename];

	// Using file-icons-js
	if (!forceVSCodeIcon) {
		const iconClass = FileIconsLibrary.getClassWithColor(filename);
		if (iconClass) return <i className={`${iconClass} file-icon`} />;
	}

	// Using vscode icons
	const svgFile = getIconForFile(filename);
	if (svgFile !== 'file.svg') return <img className='file-icon' src={`file-icons/${svgFile}`} alt={filename} />;

	// Default icon fallback (FA based or file-icon-js based)
	// return <FontAwesomeIcon name='file-alt' type='duo' color="cadetblue" secondaryColor="cadetblue" className="file-icon" />;
	return <i className={`text-icon medium-blue file-icon`} />;
};

export default React.memo(FileIcon);
