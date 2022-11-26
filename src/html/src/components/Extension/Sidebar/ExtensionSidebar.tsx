import React from 'react';
import queryString from 'query-string';
import { Flex, Icon, Text, useToasts } from '@sergiogc9/react-ui';
import { brands, solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import { useWaitInput } from 'lib/hooks/useWaitInput';
import Storage from 'lib/Storage';
import { usePageContext } from 'components/Extension/Context/PageContext';
import { useStorageContext } from 'components/Extension/Context/StorageContext';
import { useMessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { SearchContext, SearchContextData } from 'components/Extension/Context/SearchContext';
import Code from 'components/Code/Code';
import PullRequest from 'components/PullRequest/PullRequest';
import { ExtensionStatus } from 'types/Extension';

import ExtensionSettings from '../Settings/ExtensionSettings';
import ExtensionWelcome from '../Welcome/ExtensionWelcome';

import {
	StyledExtensionSidebar,
	StyledExtensionSidebarToolbar,
	StyledExtensionSidebarToolbarIconWrapper
} from './styled';

type Route = 'settings' | 'pageContent';

const ExtensionSidebar: React.FC = () => {
	const [route, setRoute] = React.useState<Route>('pageContent');
	const [status, setStatus] = React.useState<ExtensionStatus>('stop');
	const [isGithubTokenError, setIsGithubTokenError] = React.useState(false);
	const [user, setUser] = React.useState<any>();
	const {
		finalValue: searchFinalValue,
		onChangeValue: onChangeSearchValue,
		setValue: setSearchValue,
		value: searchValue
	} = useWaitInput(250);

	const pageContextData = usePageContext();
	const messageHandlers = useMessageHandlersContext()!;
	const storageContextData = useStorageContext()!;

	const { addToast } = useToasts();

	// Show notification after token has been updated
	React.useEffect(() => {
		// eslint-disable-next-line no-restricted-globals
		if (queryString.parse(location.search).token_saved) {
			addToast({
				aspectSize: 's',
				key: 'token_saved',
				message: 'The token has been saved',
				status: 'success'
			});
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(() => {
		messageHandlers.sendBackgroundMessage({ type: 'get_user' });
		messageHandlers.sendBackgroundMessage({ type: 'get_status' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'user_updated') setUser(message.data);
			if (message.type === 'status') setStatus(message.data);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(() => {
		const checkStatus = async (currentStatus: ExtensionStatus) => {
			if (currentStatus === 'error') {
				if (!(await Storage.get('github_token'))) {
					setIsGithubTokenError(true);
					messageHandlers.sendContentScriptMessage({
						type: 'sidebar_status',
						data: 'visible'
					});
				}
				// eslint-disable-next-line no-alert
				else {
					addToast({
						aspectSize: 's',
						duration: 'always',
						key: 'general_error',
						message: 'Some error ocurred, please try again later or reinstall the extension.',
						status: 'error'
					});
				}
			} else setIsGithubTokenError(false);
		};
		checkStatus(status);
	}, [status]); // eslint-disable-line react-hooks/exhaustive-deps

	const content = React.useMemo(() => {
		if (isGithubTokenError) return <ExtensionWelcome />;
		if (status !== 'synced') return null;
		if (route === 'pageContent') {
			if (pageContextData?.page === 'unknown') {
				if (storageContextData.hide_unimplemented_pages)
					messageHandlers.sendContentScriptMessage({
						type: 'sidebar_status',
						data: 'hidden'
					});
				else
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
			if (pageContextData?.page === 'code-tree') return <Code />;
			if (pageContextData?.page === 'pull-request') return <PullRequest />;
		}
		if (route === 'settings') return <ExtensionSettings />;
		return null;
	}, [
		isGithubTokenError,
		messageHandlers,
		pageContextData?.page,
		route,
		status,
		storageContextData.hide_unimplemented_pages
	]);

	const toolbarContent = React.useMemo(() => {
		if (!pageContextData?.page) return null;

		return (
			<StyledExtensionSidebarToolbar>
				<Flex alignItems="center" columnGap={1} ml={2}>
					<Icon.FontAwesome icon={brands('github')} size={12} />
					<Text aspectSize="s">{user?.login}</Text>
				</Flex>
				<StyledExtensionSidebarToolbarIconWrapper isSelected={false} ml="auto">
					<Icon.FontAwesome
						icon={solid('rotate-right')}
						onClick={() => {
							// eslint-disable-next-line no-self-assign
							window.location.href = window.location.href;
						}}
						size={12}
					/>
				</StyledExtensionSidebarToolbarIconWrapper>
				<StyledExtensionSidebarToolbarIconWrapper isSelected={route === 'settings'}>
					<Icon.FontAwesome
						icon={solid('gear')}
						onClick={() => setRoute(currentRoute => (currentRoute === 'settings' ? 'pageContent' : 'settings'))}
						size={12}
					/>
				</StyledExtensionSidebarToolbarIconWrapper>
			</StyledExtensionSidebarToolbar>
		);
	}, [pageContextData?.page, route, user]);

	const searchContextData = React.useMemo<SearchContextData>(
		() => ({
			clearSearchValue: () => setSearchValue(''),
			inputValue: searchValue,
			onChangeSearchValue,
			searchValue: searchFinalValue
		}),
		[onChangeSearchValue, searchFinalValue, searchValue, setSearchValue]
	);

	return (
		<StyledExtensionSidebar>
			<SearchContext.Provider value={searchContextData}>
				{content}
				{toolbarContent}
			</SearchContext.Provider>
		</StyledExtensionSidebar>
	);
};

export default React.memo(ExtensionSidebar);
