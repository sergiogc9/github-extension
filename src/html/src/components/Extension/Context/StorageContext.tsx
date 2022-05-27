import React from 'react';

import { PullRequestFilter } from '../Popup/PullRequests/types';
import { PopupRoute } from '../Popup/types';

export const POPUP_ROUTE_STORAGE_KEY = 'popup_selected_route';
export const POPUP_HIDDEN_PULL_REQUESTS_KEY = 'popup_hidden_pull_requests';
export const POPUP_STARRED_PULL_REQUESTS_KEY = 'popup_starred_pull_requests';
export const POPUP_TAB_ID_KEY = 'popup_tab_id';

export type StorageData = {
	token: string | null;
	group_folders: boolean | null;
	lazy_load_tree: boolean | null;
	hide_unimplemented_pages: boolean | null;
	popup_selected_route: PopupRoute | null;
	popup_hidden_pull_requests: Record<string, true> | null;
	popup_starred_pull_requests: Record<string, true> | null;
	popup_tab_id: PullRequestFilter | null;
};
export type StorageHandlers = {
	removeStorageItem: (key: string) => Promise<void>;
	setStorageItem: (key: string, value: any) => void;
};

export const StorageContext = React.createContext<StorageData | null>(null);
export const StorageHandlerContext = React.createContext<StorageHandlers | null>(null);
export const useStorageContext = () => React.useContext(StorageContext);
export const useStorageHandlerContext = () => React.useContext(StorageHandlerContext);
