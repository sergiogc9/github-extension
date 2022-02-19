import React from 'react';

import { FontAwesomeIcon, MaterialUIIcon } from 'components/common/Icon/Icon';
import { PageContext } from 'components/Extension/Context/PageContext';
import CodeTree from './Tree/CodeTree';

import './Code.scss';

const Code: React.FC = () => {
	const pageData = React.useContext(PageContext)!;

	const headerContent = React.useMemo(() => {
		const { user, repository } = pageData.data;
		return (
			<div id="githubExtensionCodeHeader" className="github-extension-header">
				<div id="githubExtensionCodeHeaderTitle" className="github-extension-header-info-title">
					<MaterialUIIcon name="library-books" />
					<a href={`https://github.com/${user}`} target="_blank" rel="noreferrer">
						{user}
					</a>
					<FontAwesomeIcon name="chevron-double-right" type="solid" />
					<a href={`https://github.com/${user}/${repository}`} target="_blank" className="bold" rel="noreferrer">
						{repository}
					</a>
				</div>
				<div id="githubExtensionCodeHeaderBranch" className="github-extension-header-branch">
					<span>{pageData.data.tree}</span>
				</div>
			</div>
		);
	}, [pageData.data]);

	return (
		<div id="githubExtensionCode" className="github-extension">
			{headerContent}
			<CodeTree />
		</div>
	);
};

export default React.memo(Code);
