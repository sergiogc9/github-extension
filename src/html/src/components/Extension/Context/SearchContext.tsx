import React from 'react';

export const SearchContext = React.createContext('');
export const useSearchContext = () => React.useContext(SearchContext);
