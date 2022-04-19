import React from 'react';
import { Box, Status } from '@sergiogc9/react-ui';

import { StyledTreeRow, StyledTreeRowText } from 'components/common/ui/Tree';
import FileIcon from 'components/common/Icon/FileIcon';
import { usePageHandlerContext } from 'components/Extension/Context/PageContext';
import { PullRequestFile as PullRequestFileType } from 'lib/Github/GithubTree';

type ComponentProps = {
	file: PullRequestFileType;
	deep: number;
	isFolderVisible: boolean;
};

const PullRequestFile: React.FC<ComponentProps> = props => {
	const { file, deep, isFolderVisible } = props;
	const pageHandlers = usePageHandlerContext()!;

	const onFileClicked = React.useCallback(() => {
		pageHandlers.goToPullRequestFile(file.path + file.name);
	}, [pageHandlers, file.path, file.name]);

	const statusContent = React.useMemo(() => {
		const commonProps = {
			ml: 1,
			size: 9
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

	return (
		<Box>
			<StyledTreeRow
				deep={deep}
				isVisible={file.visible || isFolderVisible}
				onClick={onFileClicked}
				title={file.path + file.name}
			>
				<FileIcon filename={file.name} />
				<StyledTreeRowText fontWeight={file.matchesSearch ? 'bold' : undefined}>{file.name}</StyledTreeRowText>
				{statusContent}
			</StyledTreeRow>
		</Box>
	);
};

export default React.memo(PullRequestFile);
