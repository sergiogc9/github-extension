import React from 'react';

import FileIcon from 'components/common/Icon/FileIcon';
import { PageHandlerContext } from 'components/Extension/Context/PageContext';
import { PullRequestFile as PullRequestFileType } from 'lib/Github/GithubTree';

type ComponentProps = {
	file: PullRequestFileType;
	deep: number;
	isFolderVisible: boolean;
};

const PullRequestFile: React.FC<ComponentProps> = props => {
	const { file, deep, isFolderVisible } = props;
	const pageHandlers = React.useContext(PageHandlerContext)!;

	const onFileClicked = React.useCallback(() => {
		pageHandlers.goToPullRequestFile(file.path + file.name);
	}, [pageHandlers, file.path, file.name]);

	const styles = React.useMemo(() => ({ paddingLeft: `${deep * 10}px` }), [deep]);

	const hiddenClass = React.useMemo(
		() => (file.visible || isFolderVisible ? '' : 'hidden'),
		[file.visible, isFolderVisible]
	);
	const matchClass = React.useMemo(() => (file.matchesSearch ? 'search-match' : ''), [file.matchesSearch]);

	const statusContent = React.useMemo(() => {
		if (file.status === 'added') return <span className="file-status file-added" title="File added" />;
		if (file.status === 'removed') return <span className="file-status file-removed" title="File removed" />;
		if (file.status === 'renamed') return <span className="file-status file-renamed" title="File moved" />;
		return null;
	}, [file.status]);

	return (
		<div className={`github-extension-tree-file ${hiddenClass}`}>
			<div
				className="github-extension-tree-file-content"
				style={styles}
				onClick={onFileClicked}
				title={file.path + file.name}
			>
				<FileIcon filename={file.name} />
				<span className={`file-text ${matchClass}`}>{file.name}</span>
				{statusContent}
			</div>
		</div>
	);
};

export default React.memo(PullRequestFile);
