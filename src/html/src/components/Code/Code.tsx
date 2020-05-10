import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PageContext } from '../Extension/Context/PageContext';
import CodeTree from './Tree/CodeTree';

import './Code.scss';

const Code: React.FC = props => {
	const pageData = React.useContext(PageContext)!;

	const headerContent = React.useMemo(() => {
		const { user, repository } = pageData.data;
		return <div id='githubExtensionCodeHeader' className='github-extension-header'>
			<FontAwesomeIcon icon={['far', 'code-merge']} />
			<div id="githubExtensionCodeHeaderInfo" className='github-extension-header-info'>
				<div id='githubExtensionCodeHeaderTitle' className='github-extension-header-info-title'>
					<a href={`https://github.com/${user}`} target='_blank'>{user}</a>
					<FontAwesomeIcon icon={['fas', 'chevron-double-right']} />
					<a href={`https://github.com/${user}/${repository}`} target='_blank'>{repository}</a>
				</div>
				<div id='githubExtensionCodeHeaderBranch' className='github-extension-header-branch'>
					{pageData.data.tree}
				</div>
			</div>
		</div>;
	}, [pageData.data]);

	return (
		<div id="githubExtensionCode" className='github-extension'>
			{headerContent}
			<CodeTree />
		</div>
	);
};

export default React.memo(Code);
