import { Octokit } from '@octokit/rest';
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";

import { PullRequest, PullRequestTree, CodeTree, GithubTree } from './GithubTree';
import Storage from '../Storage';

const MyOctokit = Octokit.plugin(retry, throttling);

let myOctokit: any;

const getOctokit = () => {
	const token = Storage.get('github_token');
	if (!myOctokit || myOctokit.auth !== token) {
		myOctokit = new MyOctokit({
			auth: token,
			throttle: {
				onRateLimit: (retryAfter: number, options: any) => {
					console.warn(`Request quota exhausted for request ${options.method} ${options.url}`);
					if (options.request.retryCount === 0) { // only retries once
						console.log(`Retrying after ${retryAfter} seconds!`);
						return true;
					}
				},
				onAbuseLimit: (retryAfter: number, options: any) => {
					// does not retry, only logs a warning
					console.warn(`Abuse detected for request ${options.method} ${options.url}`);
				}
			}
		});
	}
	return myOctokit;
};

const onApiError = (error: any) => {
	if (error.status === 401) {
		Storage.remove('github_token');
		window.location.reload();
	}
};

const createPullRequest = (data: any): PullRequest => ({
	state: data.state,
	branches: { base: data.base.ref, head: data.head.ref }
});

class GithubApi {
	static getPullRequestInfo = async ({ data }: any) => {
		const token = Storage.get('github_token');
		if (!token){
			 console.error('Github token not available!');
			 return;
		}
		const { user, repository, number } = data;
		try {
			const octokit = getOctokit();
			const { data } = await octokit.pulls.get({ owner: user, repo: repository, pull_number: number });
			return createPullRequest(data);
		}
		catch (e) {
			onApiError(e);
			console.error("Github Api Error");
		}
	}

	static getPullRequestFiles = async ({ data }: any) => {
		const token = Storage.get('github_token');
		if (!token){
			 console.error('Github token not available!');
			 return;
		}
		const { user, repository, number } = data;

		try {
			const octokit = getOctokit();
			const { data } = await octokit.pulls.listFiles({ owner: user, repo: repository, pull_number: number });
			const tree = new GithubTree<PullRequestTree>();
			tree.initFromPullRequestFiles(data);
			return tree;
		}
		catch (e) {
			onApiError(e);
			console.error("Github Api Error");
		}
	}

	static getCodeTree = async ({ data }: any) => {
		const token = Storage.get('github_token');
		const lazyLoad = Storage.get('lazy_load_tree');
		if (!token){
			 console.error('Github token not available!');
			 return;
		}
		const { user, repository, tree: treeSha } = data;

		try {
			const octokit = getOctokit();
			const params: any = { owner: user, repo: repository, tree_sha: treeSha };
			if (!lazyLoad) params.recursive = true;
			const { data } = await octokit.git.getTree(params);
			const tree = new GithubTree<CodeTree>();
			tree.initFromCodeTree(data, !lazyLoad);
			return tree;
		}
		catch (e) {
			onApiError(e);
			console.error("Github Api Error");
		}
	}

	static getFolderTreeData = async (user: string, repository: string, sha: string) => {
		const token = Storage.get('github_token');
		if (!token){
			 console.error('Github token not available!');
			 return;
		}

		try {
			const octokit = getOctokit();
			const { data } = await octokit.git.getTree({ owner: user, repo: repository, tree_sha: sha });
			return data;
		}
		catch (e) {
			onApiError(e);
			console.error("Github Api Error");
		}
	}
}

export default GithubApi;
