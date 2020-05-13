import React from 'react';
import { withRouter, RouteComponentProps } from "react-router";
import queryString from 'query-string';

import Storage from '../../lib/Storage';
import { PageContext, PageHandlerContext, PageData, PageHandlers, getPageData, getPullRequestFileAnchorUrl } from './Context/PageContext';
import { StorageContext, StorageHandlerContext, StorageData, StorageHandlers } from './Context/StorageContext';
import ExtensionWrapper from './Wrapper/ExtensionWrapper';

type ComponentProps = RouteComponentProps & {};

const getStorageData = async (): Promise<StorageData> => ({
	token: await Storage.get('github_token'),
	group_folders: await Storage.get('group_folders'),
	lazy_load_tree: await Storage.get('lazy_load_tree')
});

type TabData = { id: number, url: string };
const getTabData = () => new Promise<TabData | null>(resolve => {
	chrome.tabs.getCurrent(tab => {
		if (tab) resolve({ id: tab.id!, url: tab.url! });
		else resolve(null);
	});
});

const BrowserExtension: React.FC<ComponentProps> = props => {
	const { location } = props;

	const [tabId, setTabId] = React.useState<number | null>(null);
	const [pageData, setPageData] = React.useState<PageData | null>(null);
	const [storageData, setStorageData] = React.useState<StorageData>();

	// Page context stuff

	React.useEffect(() => {
		(async () => {
			setStorageData(await getStorageData());
			const tabData = await getTabData();
			if (tabData) {
				setTabId(tabData.id);
				setPageData(getPageData(tabData.url));
			} else {
				const tabUrl = queryString.parse(location.search).chromeUrl as string;
				setPageData(getPageData(tabUrl));
			}
		})();
	}, []); //eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(() => {
		// When we already have the tab id, listen for url changes
		if (tabId) {
			chrome.tabs.onUpdated.addListener((eventTabId, change, tab) => {
				if (tabId && tabId === eventTabId) {
					if (change.status === 'loading' && change.url) setPageData(pageData => pageData ? { ...pageData, isLoading: true } : null);
					else if (change.status === 'complete') {
						setPageData(pageData => !pageData || pageData.url !== tab.url! ? getPageData(tab.url!) : pageData);
					}
				}
			});
		}
	}, [tabId]);

	const onGoToPullRequestFile = React.useCallback(async (fullFileName: string) => {
		const tabData = await getTabData();
		if (tabData) chrome.tabs.update(tabData.id, { url: getPullRequestFileAnchorUrl(fullFileName, tabData.url) });
	}, []);

	const onGoToRepoPath = React.useCallback(async (path: string) => {
		const tabData = await getTabData();
		if (tabData) {
			const pageData = getPageData(tabData.url);
			const url = `https://github.com/${pageData.data.user}/${pageData.data.repository}/blob/${pageData.data.tree}/${path}`;
			chrome.tabs.update(tabData.id, { url });
		}
	}, []);

	const onOpenNewTab = React.useCallback(async (url: string) => {
		const tabData = await getTabData();
		if (tabData) chrome.tabs.update(tabData.id, { url });
	}, []);

	const pageHandlers = React.useMemo<PageHandlers>(() => ({
		goToPullRequestFile: onGoToPullRequestFile,
		goToRepoPath: onGoToRepoPath,
		openNewTab: onOpenNewTab
	}), [onGoToPullRequestFile, onGoToRepoPath, onOpenNewTab]);

	// Storage context stuff

	const onSetStorageItem = React.useCallback(async (key: string, value: any) => {
		await Storage.set(key, value);
		setStorageData(await getStorageData());
	}, []);

	const storageHandlers = React.useMemo<StorageHandlers>(() => ({
		setStorageItem: onSetStorageItem
	}), [onSetStorageItem]);

	if (!storageData) return null;

	return (
		<PageContext.Provider value={pageData}>
			<PageHandlerContext.Provider value={pageHandlers}>
				<StorageContext.Provider value={storageData}>
					<StorageHandlerContext.Provider value={storageHandlers}>
						{pageData && storageData && <ExtensionWrapper />}
					</StorageHandlerContext.Provider>
				</StorageContext.Provider>
			</PageHandlerContext.Provider>
		</PageContext.Provider>
	);
};

export default React.memo(withRouter(BrowserExtension));
