import React from 'react';
import { Flex, Text, TextField } from '@sergiogc9/react-ui';

import { useWaitInput } from 'lib/hooks/useWaitInput';
import { PageContext } from 'components/Extension/Context/PageContext';
import { StorageContext } from 'components/Extension/Context/StorageContext';
import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { SearchContext } from 'components/Extension/Context/SearchContext';
import Code from 'components/Code/Code';
import PullRequest from 'components/PullRequest/PullRequest';
import { FontAwesomeIcon } from 'components/common/Icon/Icon';

import ExtensionSettings from '../Settings/ExtensionSettings';

import {
	StyledExtensionSidebar,
	StyledExtensionSidebarToolbar,
	StyledExtensionSidebarToolbarIconWrapper
} from './styled';

type Route = 'settings' | 'pageContent';

const ExtensionSidebar: React.FC = () => {
	const [route, setRoute] = React.useState<Route>('pageContent');
	const [showSearch, setShowSearch] = React.useState(false);
	const {
		finalValue: searchFinalValue,
		onChangeValue: onChangeSearchValue,
		setValue: setSearchValue,
		value: searchValue
	} = useWaitInput(250);

	const pageContextData = React.useContext(PageContext)!;
	const messageHandlers = React.useContext(MessageHandlersContext)!;
	const storageContextData = React.useContext(StorageContext)!;

	React.useEffect(() => {
		if (showSearch) document.getElementById('githubExtensionSearchInput')?.focus();
	}, [showSearch]);

	const content = React.useMemo(() => {
		if (route === 'pageContent') {
			if (pageContextData.page === 'unknown') {
				if (!storageContextData.hide_unimplemented_pages)
					messageHandlers.sendContentScriptMessage({
						type: 'sidebar_status',
						data: 'visible'
					});
				return (
					<Flex alignItems="center" flexDirection="column" height="100%" justifyContent="center" width="100%">
						<img alt="" src="images/not-found.png" style={{ aspectRatio: '1' }} width={64} />
						<Text aspectSize="s" mt={2}>
							This page is not implemented
						</Text>
					</Flex>
				);
			}
			messageHandlers.sendContentScriptMessage({
				type: 'sidebar_status',
				data: 'visible'
			});
			if (pageContextData.page === 'code-tree') return <Code />;
			if (pageContextData.page === 'pull-request') return <PullRequest />;
		}
		if (route === 'settings') return <ExtensionSettings />;
		return null;
	}, [route, pageContextData.page, messageHandlers, storageContextData]);

	const toolbarContent = React.useMemo(
		() => (
			<StyledExtensionSidebarToolbar>
				<StyledExtensionSidebarToolbarIconWrapper isSelected={false}>
					<FontAwesomeIcon
						name="redo-alt"
						type="solid"
						onClick={() => {
							// eslint-disable-next-line no-self-assign
							window.location.href = window.location.href;
						}}
					/>
				</StyledExtensionSidebarToolbarIconWrapper>
				{pageContextData.page !== 'unknown' && (
					<StyledExtensionSidebarToolbarIconWrapper isSelected={showSearch}>
						<FontAwesomeIcon
							name={showSearch ? 'times' : 'search'}
							type="solid"
							onClick={() => {
								setShowSearch(show => {
									if (show) setSearchValue('');
									return !show;
								});
							}}
						/>
					</StyledExtensionSidebarToolbarIconWrapper>
				)}
				{showSearch && (
					<TextField
						aspectSize="s"
						mr={2}
						placeholder="Search folders or files"
						value={searchValue}
						onChange={onChangeSearchValue}
					/>
				)}
				<StyledExtensionSidebarToolbarIconWrapper isSelected={route === 'settings'} ml="auto">
					<FontAwesomeIcon
						name="cog"
						type="solid"
						onClick={() => setRoute(currentRoute => (currentRoute === 'settings' ? 'pageContent' : 'settings'))}
					/>
				</StyledExtensionSidebarToolbarIconWrapper>
			</StyledExtensionSidebarToolbar>
		),
		[pageContextData.page, showSearch, searchValue, onChangeSearchValue, route, setSearchValue]
	);

	return (
		<StyledExtensionSidebar>
			<SearchContext.Provider value={searchFinalValue}>
				{content}
				{toolbarContent}
			</SearchContext.Provider>
		</StyledExtensionSidebar>
	);
};

export default React.memo(ExtensionSidebar);
