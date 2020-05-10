import React from 'react';
import md5 from 'md5';
import Url from 'url-parse';

type GithubPage = 'code-tree' | 'pull-request';
export type PageData = { page: GithubPage, isLoading: boolean, url: string, data: any };
export type PageHandlers = {
	openNewTab: (url: string) => void
	goToPullRequestFile: (fullFileName: string) => void
	goToRepoPath: (path:string) => void // Path can be both a folder or file path
};

export const getPageData = (url: string): PageData => {
	const parsedUrl = new Url(url);
	const path = parsedUrl.pathname.replace(/\/$/, ''); // only pathname without final slash
	// Case master branch
	let matchData = path.match(/^\/([^\/]+)\/([^\/]+)$/);
	if (matchData) return { page: 'code-tree', isLoading: false, url, data: { user: matchData[1], repository: matchData[2], tree: 'master' } };
	// Case custom branch
	matchData = path.match(/^\/([^\/]*)\/([^\/]*)\/tree\/([^\/]*)$/);
	if (matchData) return { page: 'code-tree', isLoading: false, url, data: { user: matchData[1], repository: matchData[2], tree: matchData[3] } };
	// Case Pull Request
	matchData = path.match(/^\/([^\/]*)\/([^\/]*)\/pull\/([0-9]*)/);
	if (matchData) return { page: 'pull-request', isLoading: false, url, data: { user: matchData[1], repository: matchData[2], number: parseInt(matchData[3]) } };
	throw new Error('Github page not defined!');
};

export const getPullRequestFileAnchorUrl = (fullFileName: string, currentUrl: string) => {
	const pageData = getPageData(currentUrl);
	const fullFileNamesHash = `diff-${md5(fullFileName)}`;
	return `https://github.com/${pageData.data.user}/${pageData.data.repository}/pull/${pageData.data.number}/files#${fullFileNamesHash}`;
};

export const PageContext = React.createContext<PageData | null>(null);
export const PageHandlerContext = React.createContext<PageHandlers | null>(null);
