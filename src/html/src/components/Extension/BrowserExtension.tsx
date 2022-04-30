import React from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import find from 'lodash/find';
import { Toasts } from '@sergiogc9/react-ui';

import Storage from 'lib/Storage';
import GithubApi from 'lib/Github/GithubApi';
import { MessageHandler, Message, MessageSendResponse } from 'types/Message';
import { TabData } from 'types/Tab';

import {
	PageContext,
	PageHandlerContext,
	PageData,
	PageHandlers,
	getPageData,
	getPullRequestFileAnchorUrl
} from './Context/PageContext';
import { StorageContext, StorageHandlerContext, StorageData, StorageHandlers } from './Context/StorageContext';
import { MessageHandlersContext, MessageHandlers } from './Context/MessageContext';
import ExtensionSidebar from './Sidebar/ExtensionSidebar';
import ExtensionPopup from './Popup/ExtensionPopup';

const getStorageData = async (): Promise<StorageData> => ({
	token: await Storage.get('github_token'),
	group_folders: await Storage.get('group_folders'),
	lazy_load_tree: await Storage.get('lazy_load_tree'),
	hide_unimplemented_pages: await Storage.get('hide_unimplemented_pages')
});

const getTabData = () =>
	new Promise<TabData | null>(resolve => {
		chrome.runtime.sendMessage({ type: 'tab_helper', data: { action: 'get_current' } }, resolve);
	});

const getCorrectRepoBranch = async (pageData: PageData) => {
	if (pageData.page === 'code-tree') {
		if (pageData.data.tree === 'default') {
			const defaultBranch = await GithubApi.getRepoDefaultBranch(pageData.data.user, pageData.data.repository);
			pageData.data.tree = defaultBranch;
		} else {
			const branches = (await GithubApi.getRepoBranches(pageData.data.user, pageData.data.repository)) as string[];
			const branch = find(branches, br => pageData.data.tree.match(`^${br}`));
			if (branch) pageData.data.tree = branch;
		}
	}
};

const BrowserExtension = () => {
	const location = useLocation();

	const [pageData, setPageData] = React.useState<PageData | null>(null);
	const [finalPageData, setFinalPageData] = React.useState<PageData | null>(null);
	const [storageData, setStorageData] = React.useState<StorageData>();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const isPopup = React.useMemo(() => !!queryString.parse(location.search).popup, []);

	// Page context stuff

	React.useEffect(() => {
		(async () => {
			setStorageData(await getStorageData());
			const tabData = await getTabData();
			const url = tabData ? tabData.url : (queryString.parse(location.search).chromeUrl as string);
			const newPageData = getPageData(url);

			setPageData(newPageData);
		})();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(() => {
		(async () => {
			if (pageData) {
				await getCorrectRepoBranch(pageData);
				setFinalPageData(pageData);
			}
		})();
	}, [pageData]); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(() => {
		// Listen for tab update events
		chrome.runtime.onMessage.addListener((message: any) => {
			if (message.type === 'tab_updated') {
				const { change, tab } = message.data;

				if (change.status === 'loading' && change.url)
					setPageData(currentPageData => (currentPageData ? { ...currentPageData, isLoading: true } : null));
				else if (change.status === 'complete') {
					setPageData(currentPageData =>
						!currentPageData || currentPageData.url !== tab.url! ? getPageData(tab.url!) : pageData
					);
				}
			}
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const onGoToPullRequestFile = React.useCallback(async (fullFileName: string) => {
		const tabData = await getTabData();
		if (tabData)
			chrome.runtime.sendMessage({
				type: 'tab_helper',
				data: {
					action: 'update_tab',
					url: getPullRequestFileAnchorUrl(fullFileName, tabData.url)
				}
			});
	}, []);

	const onGoToRepoPath = React.useCallback(async (path: string) => {
		const tabData = await getTabData();
		if (tabData) {
			const newPageData = getPageData(tabData.url);
			await getCorrectRepoBranch(newPageData);
			const url = `https://github.com/${newPageData.data.user}/${newPageData.data.repository}/blob/${newPageData.data.tree}/${path}`;
			chrome.runtime.sendMessage({
				type: 'tab_helper',
				data: { action: 'update_tab', url }
			});
		}
	}, []);

	const onOpenNewTab = React.useCallback(async (url: string) => {
		chrome.runtime.sendMessage({
			type: 'tab_helper',
			data: { action: 'create_tab', url }
		});
	}, []);

	const pageHandlers = React.useMemo<PageHandlers>(
		() => ({
			goToPullRequestFile: onGoToPullRequestFile,
			goToRepoPath: onGoToRepoPath,
			openNewTab: onOpenNewTab
		}),
		[onGoToPullRequestFile, onGoToRepoPath, onOpenNewTab]
	);

	// Storage context stuff

	const onSetStorageItem = React.useCallback(async (key: string, value: any) => {
		await Storage.set(key, value);
		setStorageData(await getStorageData());
	}, []);

	const onRemoveStorageItem = React.useCallback(async (key: string) => {
		await Storage.remove(key);
		setStorageData(await getStorageData());
	}, []);

	const storageHandlers = React.useMemo<StorageHandlers>(
		() => ({
			removeStorageItem: onRemoveStorageItem,
			setStorageItem: onSetStorageItem
		}),
		[onRemoveStorageItem, onSetStorageItem]
	);

	// Message context stuff

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onSendContentScriptMessage = React.useCallback(async (message: Message, sendResponse?: MessageSendResponse) => {
		const tabData = await getTabData();
		if (tabData)
			chrome.runtime.sendMessage({
				type: 'tab_helper',
				data: { action: 'send_data', message }
			});
	}, []);

	const onSendBackgroundMessage = React.useCallback((message: Message, sendResponse?: MessageSendResponse) => {
		chrome.runtime.sendMessage(message, sendResponse);
	}, []);

	const onReceiveBackgroundMessage = React.useCallback((func: MessageHandler) => {
		chrome.runtime.onMessage.addListener(request => func(request));
	}, []);

	const messageHandlers = React.useMemo<MessageHandlers>(
		() => ({
			sendContentScriptMessage: onSendContentScriptMessage,
			onBackgroundMessage: onReceiveBackgroundMessage,
			sendBackgroundMessage: onSendBackgroundMessage
		}),
		[onSendContentScriptMessage, onSendBackgroundMessage, onReceiveBackgroundMessage]
	);

	if (!storageData) return null;

	return (
		<MessageHandlersContext.Provider value={messageHandlers}>
			<PageContext.Provider value={finalPageData}>
				<PageHandlerContext.Provider value={pageHandlers}>
					<StorageContext.Provider value={storageData}>
						<StorageHandlerContext.Provider value={storageHandlers}>
							<Toasts placement="top">
								{finalPageData && storageData && !isPopup && <ExtensionSidebar />}
								{storageData && isPopup && <ExtensionPopup />}
							</Toasts>
						</StorageHandlerContext.Provider>
					</StorageContext.Provider>
				</PageHandlerContext.Provider>
			</PageContext.Provider>
		</MessageHandlersContext.Provider>
	);
};

export default React.memo(BrowserExtension);
