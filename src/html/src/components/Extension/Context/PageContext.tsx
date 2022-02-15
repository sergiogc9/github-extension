import React from 'react';
import {sha256} from 'sha.js';
import Url from 'url-parse';

type GithubPage = 'code-tree' | 'pull-request';
export type PageData = { page: GithubPage | 'unknown', isLoading: boolean, url: string, data: any };
export type PageHandlers = {
	openNewTab: (url: string) => void
	goToPullRequestFile: (fullFileName: string) => void
	goToRepoPath: (path: string) => void // Path can be both a folder or file path
};

export const getPageData = (url: string): PageData => {
	const parsedUrl = new Url(url);
	const path = parsedUrl.pathname.replace(/\/$/, ''); // only pathname without final slash
	// Case default branch
	let matchData = path.match(/^\/([^\/]+)\/([^\/]+)$/);
	if (matchData) return { page: 'code-tree', isLoading: false, url, data: { user: matchData[1], repository: matchData[2], tree: 'default' } };
	// Case custom branch or path
	matchData = path.match(/^\/([^\/]*)\/([^\/]*)\/(tree|blob)\/(.*)$/);
	if (matchData) return { page: 'code-tree', isLoading: false, url, data: { user: matchData[1], repository: matchData[2], tree: matchData[4] } };
	// Case Pull Request
	matchData = path.match(/^\/([^\/]*)\/([^\/]*)\/pull\/([0-9]*)/);
	if (matchData) return { page: 'pull-request', isLoading: false, url, data: { user: matchData[1], repository: matchData[2], number: parseInt(matchData[3]) } };
	return { page: 'unknown', isLoading: false, url: '', data: {} };
};

export const getPullRequestFileAnchorUrl = (fullFileName: string, currentUrl: string) => {
	const pageData = getPageData(currentUrl);
	const fullFileNamesHash = `diff-${new sha256().update(fullFileName).digest('hex')}`;
	return `https://github.com/${pageData.data.user}/${pageData.data.repository}/pull/${pageData.data.number}/files#${fullFileNamesHash}`;
};

export const PageContext = React.createContext<PageData | null>(null);
export const PageHandlerContext = React.createContext<PageHandlers | null>(null);
