import React from 'react';
import TextField from '@duik/text-field';

import { useWaitInput } from 'lib/hooks/input';
import { PageContext } from 'components/Extension/Context/PageContext';
import { StorageContext } from 'components/Extension/Context/StorageContext';
import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { SearchContext } from 'components/Extension/Context/SearchContext';
import Code from 'components/Code/Code';
import PullRequest from 'components/PullRequest/PullRequest';
import ExtensionSettings from '../Settings/ExtensionSettings';
import { FontAwesomeIcon } from 'components/common/Icon/Icon';

import './ExtensionSidebar.scss';

type Route = 'settings' | 'pageContent';

const ExtensionSidebar: React.FC = props => {
	const [route, setRoute] = React.useState<Route>('pageContent');
	const [showSearch, setShowSearch] = React.useState(false);
	const { value: searchValue, finalValue: searchFinalValue, setValue: setSearchValue, onChangeValue: onChangeSearchValue } = useWaitInput(250);

	const pageContextData = React.useContext(PageContext)!;
	const messageHandlers = React.useContext(MessageHandlersContext)!;
	const storageContextData = React.useContext(StorageContext)!;

	React.useEffect(() => {
		if (showSearch) document.getElementById('githubExtensionSearchInput')?.focus();
	}, [showSearch]);

	const content = React.useMemo(() => {
		if (route === 'pageContent') {
			if (pageContextData.page === 'unknown') {
				if (!storageContextData.hide_unimplemented_pages) messageHandlers.sendContentScriptMessage({ type: 'sidebar_status', data: 'visible' });
				return (
					<div className='page-not-defined'>
						<img src='images/not-found.png' alt='' />
						<span>This page is not implemented</span>
					</div>
				);
			}
			messageHandlers.sendContentScriptMessage({ type: 'sidebar_status', data: 'visible' });
			if (pageContextData.page === 'code-tree') return <Code />;
			if (pageContextData.page === 'pull-request') return <PullRequest />;
		}
		if (route === 'settings') return <ExtensionSettings />;
		return null;
	}, [route, pageContextData.page, messageHandlers, storageContextData]);

	const toolbarContent = React.useMemo(() => (
		<div id="githubExtensionAppBottomToolbar">
			<FontAwesomeIcon name='redo-alt' type='solid' onClick={() => {
				// eslint-disable-next-line no-self-assign
				window.location.href = window.location.href;
			}} />
			{pageContextData.page !== 'unknown' && <FontAwesomeIcon name={showSearch ? 'times' : 'search'} type='solid' className={showSearch ? 'selected' : ''} onClick={() => {
				setShowSearch(show => {
					if (show) setSearchValue('');
					return !show;
				});
			}} />}
			{showSearch && <TextField id="githubExtensionSearchInput" placeholder="Search folders or files" value={searchValue} onChange={onChangeSearchValue} />}
			<FontAwesomeIcon name='cog' type='solid' className={route === 'settings' ? 'selected' : ''}
				onClick={() => setRoute(route => route === 'settings' ? 'pageContent' : 'settings')}
			/>
		</div>
	), [showSearch, route, searchValue, pageContextData.page, onChangeSearchValue, setSearchValue]);

	return (
		<div id="githubExtensionApp">
			<SearchContext.Provider value={searchFinalValue}>
				{content}
				{toolbarContent}
			</SearchContext.Provider>
		</div>
	);
};

export default React.memo(ExtensionSidebar);
