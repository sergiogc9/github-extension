import React from 'react';
import TextField from '@duik/text-field';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useWaitInput } from '../../../lib/hooks/input';
import { PageContext } from '../Context/PageContext';
import { SearchContext } from '../Context/SearchContext';
import Code from '../../Code/Code';
import PullRequest from '../../PullRequest/PullRequest';
import ExtensionSettings from '../Settings/ExtensionSettings';

import './ExtensionWrapper.scss';

type Route = 'settings' | 'pageContent';

const ExtensionWrapper: React.FC = props => {
	const [route, setRoute] = React.useState<Route>('pageContent');
	const [showSearch, setShowSearch] = React.useState(false);
	const { value: searchValue, finalValue: searchFinalValue, setValue: setSearchValue, onChangeValue: onChangeSearchValue } = useWaitInput(250);

	const pageContextData = React.useContext(PageContext)!;

	React.useEffect(() => {
		if (showSearch) document.getElementById('githubExtensionSearchInput')?.focus();
	}, [showSearch]);

	const content = React.useMemo(() => {
		if (route === 'pageContent') {
			if (pageContextData.page === 'code-tree') return <Code />;
			if (pageContextData.page === 'pull-request') return <PullRequest />;
		}
		if (route === 'settings') return <ExtensionSettings />;
		return null;
	}, [route, pageContextData.page]);

	const toolbarContent = React.useMemo(() => (
		<div id="githubExtensionAppBottomToolbar">
			<FontAwesomeIcon icon={["fad", showSearch ? 'times-circle' : 'search']} onClick={() => {
				setShowSearch(show => {
					if (show) setSearchValue('');
					return !show;
				});
			}} />
			{showSearch && <TextField id="githubExtensionSearchInput" placeholder="Search folders or files" value={searchValue} onChange={onChangeSearchValue} />}
			<FontAwesomeIcon
				icon={["fad", "cog"]}
				className={route === 'settings' ? 'selected' : ''}
				onClick={() => setRoute(route => route === 'settings' ? 'pageContent' : 'settings')}
			/>
		</div>
	), [showSearch, route, searchValue, onChangeSearchValue, setSearchValue]);

	return (
		<div id="githubExtensionApp">
			<SearchContext.Provider value={searchFinalValue}>
				{content}
				{toolbarContent}
			</SearchContext.Provider>
		</div>
	);
};

export default React.memo(ExtensionWrapper);
