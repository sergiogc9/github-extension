import React from 'react';

export type SearchContextData = {
	clearSearchValue: () => void;
	inputValue: string;
	onChangeSearchValue: (ev: React.ChangeEvent) => void;
	searchValue: string;
};

export const SearchContext = React.createContext<SearchContextData>({} as any);
export const useSearchContext = () => React.useContext(SearchContext);
