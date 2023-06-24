import React from 'react';
import { Box, Status } from '@sergiogc9/react-ui';

import { StyledTreeRow, StyledTreeRowText } from 'components/common/ui/Tree';
import FileIcon from 'components/common/Icon/FileIcon';
import { usePageContext, usePageHandlerContext } from 'components/Extension/Context/PageContext';
import { PullRequestFile as PullRequestFileType } from 'lib/Github/GithubTree';
import { sha256 } from 'sha.js';

type ComponentProps = {
	file: PullRequestFileType;
	deep: number;
	isFolderVisible: boolean;
};

const PullRequestFile: React.FC<ComponentProps> = props => {
	const { file, deep, isFolderVisible } = props;
	const pageHandlers = usePageHandlerContext()!;
	const pageData = usePageContext();

	const onFileClicked = React.useCallback(() => {
		pageHandlers.goToPullRequestFile(file.path + file.name);
	}, [pageHandlers, file.path, file.name]);

	const statusContent = React.useMemo(() => {
		const commonProps = {
			ml: 1,
			size: 9,
			flexShrink: 0
		};
		if (file.status === 'added') return <Status {...commonProps} bg="green.600" title="File added" />;
		if (file.status === 'removed') return <Status {...commonProps} bg="red.600" title="File removed" />;
		if (file.status === 'renamed')
			return (
				<Status
					{...commonProps}
					bg="blue.500"
					title={`File moved\nFROM:\n${file.previousName}\nTO:\n${file.path}${file.name}`}
				/>
			);
		return null;
	}, [file.name, file.path, file.previousName, file.status]);

	const isCurrentFile = React.useMemo(
		// eslint-disable-next-line new-cap
		() => !!pageData?.url.match(`#diff-${new sha256().update(file.path + file.name).digest('hex')}$`),
		[file.name, file.path, pageData?.url]
	);

	return (
		<Box>
			<StyledTreeRow
				deep={deep}
				isHighlighted={isCurrentFile}
				isVisible={file.visible || isFolderVisible}
				onClick={onFileClicked}
				title={file.path + file.name}
			>
				<FileIcon filename={file.name} />
				<StyledTreeRowText fontWeight={file.matchesSearch || isCurrentFile ? 'bold' : undefined}>
					{file.name}
				</StyledTreeRowText>
				{statusContent}
			</StyledTreeRow>
		</Box>
	);
};

export default React.memo(PullRequestFile);
