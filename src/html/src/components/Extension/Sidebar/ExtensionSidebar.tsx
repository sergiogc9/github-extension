import React from 'react';
import { Flex, Icon, Text, TextField } from '@sergiogc9/react-ui';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import { useWaitInput } from 'lib/hooks/useWaitInput';
import { usePageContext } from 'components/Extension/Context/PageContext';
import { useStorageContext } from 'components/Extension/Context/StorageContext';
import { useMessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { SearchContext } from 'components/Extension/Context/SearchContext';
import Code from 'components/Code/Code';
import PullRequest from 'components/PullRequest/PullRequest';

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

	const pageContextData = usePageContext()!;
	const messageHandlers = useMessageHandlersContext()!;
	const storageContextData = useStorageContext()!;

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
					<Icon.FontAwesome
						icon={solid('rotate-right')}
						onClick={() => {
							// eslint-disable-next-line no-self-assign
							window.location.href = window.location.href;
						}}
						size={12}
					/>
				</StyledExtensionSidebarToolbarIconWrapper>
				{pageContextData.page !== 'unknown' && (
					<StyledExtensionSidebarToolbarIconWrapper isSelected={showSearch}>
						<Icon.FontAwesome
							icon={showSearch ? solid('xmark') : solid('magnifying-glass')}
							onClick={() => {
								setShowSearch(show => {
									if (show) setSearchValue('');
									return !show;
								});
							}}
							size={12}
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
					<Icon.FontAwesome
						icon={solid('gear')}
						onClick={() => setRoute(currentRoute => (currentRoute === 'settings' ? 'pageContent' : 'settings'))}
						size={12}
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
