import React from 'react';
import { Box } from '@sergiogc9/react-ui';

import { StyledTreeRow, StyledTreeRowText } from 'components/common/ui/Tree';
import FileIcon from 'components/common/Icon/FileIcon';
import { usePageContext, usePageHandlerContext } from 'components/Extension/Context/PageContext';
import { CodeTreeFile as CodeTreeFileType } from 'lib/Github/GithubTree';

type ComponentProps = {
	file: CodeTreeFileType;
	deep: number;
	isFolderVisible: boolean;
};

const CodeTreeFile: React.FC<ComponentProps> = props => {
	const { file, deep, isFolderVisible } = props;
	const pageHandlers = usePageHandlerContext()!;
	const pageData = usePageContext();

	const isCurrentFile = React.useMemo(
		() => !!pageData?.url.match(`/${pageData.data.tree}/${file.path}${file.name}$`),
		[file.name, file.path, pageData]
	);

	const onFileClicked = React.useCallback(() => {
		pageHandlers.goToRepoPath(file.path + file.name);
	}, [pageHandlers, file.path, file.name]);

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
			</StyledTreeRow>
		</Box>
	);
};

export default React.memo(CodeTreeFile);
