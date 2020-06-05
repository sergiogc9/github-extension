import React from 'react';

import FileIcon from 'components/common/Icon/FileIcon';
import { PageHandlerContext } from 'components/Extension/Context/PageContext';
import { CodeTreeFile as CodeTreeFileType } from 'lib/Github/GithubTree';

type ComponentProps = {
	file: CodeTreeFileType
	deep: number
	isFolderVisible: boolean
}

const CodeTreeFile: React.FC<ComponentProps> = props => {
	const { file, deep, isFolderVisible } = props;
	const pageHandlers = React.useContext(PageHandlerContext)!;

	const onFileClicked = React.useCallback(() => {
		pageHandlers.goToRepoPath(file.path + file.name);
	}, [pageHandlers, file.path, file.name]);

	const styles = React.useMemo(() => ({ paddingLeft: `${deep * 10}px` }), [deep]);

	const hiddenClass = React.useMemo(() => file.visible || isFolderVisible ? '' : 'hidden', [file.visible, isFolderVisible]);
	const matchClass = React.useMemo(() => file.matchesSearch ? 'search-match' : '', [file.matchesSearch]);

	return (
		<div className={`github-extension-tree-file ${hiddenClass}`}>
			<div className='github-extension-tree-file-content' style={styles} onClick={onFileClicked} title={file.path + file.name}>
				<FileIcon filename={file.name} />
				<span className={`file-text ${matchClass}`}>{file.name}</span>
			</div>
		</div>
	);
};

export default React.memo(CodeTreeFile);
