import React from 'react';

export type StorageData = {
	token: string;
	group_folders: boolean;
	lazy_load_tree: boolean;
	hide_unimplemented_pages: boolean;
};
export type StorageHandlers = {
	setStorageItem: (key: string, value: any) => void;
};

export const StorageContext = React.createContext<StorageData | null>(null);
export const StorageHandlerContext = React.createContext<StorageHandlers | null>(null);
export const useStorageContext = () => React.useContext(StorageContext);
export const useStorageHandlerContext = () => React.useContext(StorageHandlerContext);
