/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { Octokit } from '@octokit/rest';
import { retry } from '@octokit/plugin-retry';
// import { throttling } from '@octokit/plugin-throttling';
import concat from 'lodash/concat';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import find from 'lodash/find';

import Storage from 'lib/Storage';
import { GithubPullRequest, GithubReviews, GithubReview, GithubChecks } from 'types/Github';

import Log from 'lib/Log';
import { PullRequestTree, CodeTree, GithubTree } from './GithubTree';

// TODO: Check enabling again throttling. Disabled because it was delaying request making the sidebar to appear too much late.
// const MyOctokit = Octokit.plugin(retry, throttling);
const MyOctokit = Octokit.plugin(retry);

let myOctokit: any;

const __defaultRepoDefaultBranchCache: Record<string, string> = {};
const __defaultRepoBranchesCache: Record<string, 'fetching' | string[]> = {};

const getOctokit = async ({ token: forcedToken }: { token?: string } = {}) => {
	const token = forcedToken ?? (await Storage.get('github_token'));
	if (!token) {
		Log.error('Github token not available!');
		throw new Error('Github token not available! Please enter a valid token in settings page.');
	}
	if (!myOctokit || myOctokit.auth !== token) {
		myOctokit = new MyOctokit({
			auth: token,
			throttle: {
				onRateLimit: (retryAfter: number, options: any) => {
					Log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);
					if (options.request.retryCount === 0) {
						// only retries once
						Log.info(`Retrying after ${retryAfter} seconds!`);
						return true;
					}
				},
				onAbuseLimit: (retryAfter: number, options: any) => {
					// does not retry, only logs a warning
					Log.warn(`Abuse detected for request ${options.method} ${options.url}`);
				}
			}
		});
	}
	return myOctokit;
};

const onApiError = (error: any) => {
	Log.error('Github Api Error');
	Log.error(error);
	if (error.status === 401) {
		Storage.remove('github_token');
		window.location.reload();
	}
	throw error;
};

const parseCommonPullRequestData = (data: any) => {
	// eslint-disable-next-line no-useless-escape
	const [, owner, repository] = data.html_url.match(/^https:\/\/github\.com\/([^\/]*)\/([^\/]*)\/.*$/);

	return {
		updated_at: data.updated_at,
		title: data.title,
		state: data.state,
		number: data.number,
		user: { username: data.user.login },
		labels: data.labels,
		owner,
		repository
	};
};

const addPullRequestReviews = (pullRequest: GithubPullRequest, pullRequestData: any, reviewsData: any) => {
	const reviews: GithubReviews = {};
	let reviewsWithComments = 0;
	for (const reviewData of reviewsData) {
		if (reviewData.user.login === pullRequest.user.username) continue;
		if (!isEmpty(reviewData.body)) reviewsWithComments++;
		const currentReview = reviews[reviewData.user.login];
		const review: GithubReview = {
			user: reviewData.user.login,
			state: reviewData.state,
			date: reviewData.submitted_at,
			userImgUrl: reviewData.user.avatar_url
		};
		if (reviewData.state === 'DISMISSED') review.state = 'COMMENTED';
		if (currentReview) {
			if (reviewData.state === 'COMMENTED' && currentReview.state !== 'PENDING') continue;
		}
		reviews[reviewData.user.login] = review;
	}

	// Add pending reviewers (users)
	for (const reviewer of pullRequestData.requested_reviewers) {
		if (reviews[reviewer.login]) continue;
		reviews[reviewer.login] = { user: reviewer.login, state: 'PENDING', userImgUrl: reviewer.avatar_url };
	}

	// Add pending reviewers (teams)
	for (const team of pullRequestData.requested_teams) {
		if (reviews[team.slug]) continue;
		reviews[team.slug] = {
			user: team.name,
			state: 'PENDING',
			userImgUrl: `https://avatars2.githubusercontent.com/t/${team.id}?v=4`
		};
	}

	pullRequest.reviews = reviews;
	pullRequest.comments += reviewsWithComments;
};

const createPullRequest = (data: any): GithubPullRequest => {
	const pullRequest: GithubPullRequest = {
		...parseCommonPullRequestData(data),
		branches: { base: data.base.ref, head: data.head.ref },
		additions: data.additions,
		deletions: data.deletions,
		commits: data.commits,
		changedFiles: data.changed_files,
		comments: data.comments,
		reviewComments: data.review_comments,
		merged: data.merged,
		mergeable: data.mergeable,
		mergeable_status: data.mergeable_status
	};

	if (data.reviews) addPullRequestReviews(pullRequest, data, data.reviews);

	return pullRequest;
};

const createPullRequestFromSearch = (data: any): GithubPullRequest[] =>
	data.items.map((itemData: any) => ({
		...parseCommonPullRequestData(itemData)
	}));

const getArrayOfNumbers = (start: number, length: number) =>
	Array.from(new Array(length), (val, index) => index + start);

const getPaginationData = (apiResponse: any) => {
	const { link } = apiResponse.headers;
	if (!link) return { page: 1, total: 1 };
	const [, nextPage, totalPages] = link.match(/&page=(\d)>.*&page=(\d)/);
	return { page: parseInt(nextPage, 10) - 1, total: parseInt(totalPages, 10) };
};

class GithubApi {
	static getPullRequestInfo = async ({ data }: any) => {
		const { user, repository, number } = data;
		try {
			const octokit = await getOctokit();
			const requests = [
				octokit.pulls.get({ owner: user, repo: repository, pull_number: number }),
				octokit.pulls.listReviews({ owner: user, repo: repository, pull_number: number })
			];
			const [prResponse, reviewsResponse] = await Promise.all(requests);
			const pr = createPullRequest({ ...prResponse.data, reviews: reviewsResponse.data });
			pr.checks = await GithubApi.getPullRequestChecks({
				owner: user,
				repo: repository,
				commit_sha: prResponse.data.head.sha
			});
			return pr;
		} catch (e) {
			onApiError(e);
		}
	};

	static getPullRequestChecks = async (data: {
		owner: string;
		repo: string;
		commit_sha: string;
	}): Promise<GithubChecks> => {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const { owner, repo, commit_sha } = data;
		const octokit = await getOctokit();
		const requests = [
			octokit.repos.getCombinedStatusForRef({ owner, repo, ref: commit_sha }),
			octokit.checks.listForRef({ owner, repo, ref: commit_sha })
		];
		const [prStatusesResponse, runChecksResponse] = await Promise.all(requests);

		const checks: GithubChecks = {
			failed: 0,
			neutral: 0,
			pending: 0,
			success: 0
		};

		forEach(prStatusesResponse.data.statuses, status => {
			if (status.state === 'success') checks.success++;
			else if (status.state === 'pending') checks.pending++;
			else checks.failed++;
		});
		forEach(runChecksResponse.data.check_runs, run => {
			if (run.status === 'completed') {
				if (run.conclusion === 'success') checks.success++;
				else if (['neutral', 'cancelled', 'skipped'].includes(run.conclusion)) checks.neutral++;
				else checks.failed++;
			} else checks.pending++;
		});
		return checks;
	};

	static getPullRequestFiles = async ({ data }: any) => {
		const { user, repository, number } = data;

		try {
			const octokit = await getOctokit();
			// Fetch first page
			const apiResponse = await octokit.pulls.listFiles({
				owner: user,
				repo: repository,
				pull_number: number,
				per_page: 100
			});
			const { total } = getPaginationData(apiResponse);
			let { data: apiData } = apiResponse;
			if (total > 1) {
				// eslint-disable-next-line no-alert
				if (total > 10) alert('Maximum number of files loaded limited to 1000 to prevent Github API rate limits.');
				// Fetch data from page 2 to page up to 10, hence limit is 1000 files
				const fetchs = getArrayOfNumbers(2, Math.min(total - 1, 9)).map(pageNumber => {
					return octokit.pulls.listFiles({
						owner: user,
						page: pageNumber,
						per_page: 100,
						pull_number: number,
						repo: repository
					});
				});
				const dataArray = await Promise.all(fetchs);
				apiData = concat(apiResponse.data, flatten(dataArray.map(resp => resp.data)));
			}
			const tree = new GithubTree<PullRequestTree>();
			tree.initFromPullRequestFiles(apiData);
			return tree;
		} catch (e) {
			onApiError(e);
		}
	};

	static getRepoDefaultBranch = async (user: string, repository: string) => {
		try {
			const cacheKey = `${user}/${repository}`;
			if (!__defaultRepoDefaultBranchCache[cacheKey]) {
				__defaultRepoDefaultBranchCache[cacheKey] = 'fetching';
				const octokit = await getOctokit();
				const { data: repoData } = await octokit.repos.get({ repo: repository, owner: user });
				__defaultRepoDefaultBranchCache[cacheKey] = repoData.default_branch;
			} else if (__defaultRepoDefaultBranchCache[cacheKey] === 'fetching') {
				// Avoid multiple api calls for same repository
				return await new Promise(resolve =>
					setTimeout(() => {
						GithubApi.getRepoDefaultBranch(user, repository).then(resolve);
					}, 100)
				);
			}
			return __defaultRepoDefaultBranchCache[cacheKey];
		} catch (e) {
			onApiError(e);
		}
	};

	static getRepoBranches = async (user: string, repository: string) => {
		try {
			const cacheKey = `${user}/${repository}`;
			if (!__defaultRepoBranchesCache[cacheKey]) {
				__defaultRepoBranchesCache[cacheKey] = 'fetching';
				const octokit = await getOctokit();
				const { data: branches } = await octokit.repos.listBranches({ repo: repository, owner: user, per_page: 100 });
				__defaultRepoBranchesCache[cacheKey] = branches.map((br: any) => br.name);
			} else if (__defaultRepoBranchesCache[cacheKey] === 'fetching') {
				// Avoid multiple api calls for same repository
				return await new Promise(resolve =>
					setTimeout(() => {
						GithubApi.getRepoBranches(user, repository).then(resolve);
					}, 100)
				);
			}
			return __defaultRepoBranchesCache[cacheKey];
		} catch (e) {
			onApiError(e);
		}
	};

	static getCodeTree = async ({ data }: any) => {
		const lazyLoad = await Storage.get('lazy_load_tree');
		const { user, repository, tree: treeSha } = data;

		try {
			const octokit = await getOctokit();
			const params: any = { owner: user, repo: repository, tree_sha: treeSha };
			if (!lazyLoad) params.recursive = true;
			const { data: apiData } = await octokit.git.getTree(params);
			const tree = new GithubTree<CodeTree>();
			tree.initFromCodeTree(apiData, !lazyLoad);
			return tree;
		} catch (e) {
			onApiError(e);
		}
	};

	static getFolderTreeData = async (user: string, repository: string, sha: string) => {
		try {
			const octokit = await getOctokit();
			const { data } = await octokit.git.getTree({ owner: user, repo: repository, tree_sha: sha });
			return data;
		} catch (e) {
			onApiError(e);
		}
	};

	static getUserData = async () => {
		try {
			const octokit = await getOctokit();
			const { data } = await octokit.users.getAuthenticated();
			return data;
		} catch (e) {
			onApiError(e);
		}
	};

	static getUserPullRequests = async (username: string) => {
		try {
			const query = `is:open+involves:${username}+is:pr`;
			const octokit = await getOctokit();
			const { data } = await octokit.search.issuesAndPullRequests({ q: query });
			return createPullRequestFromSearch(data);
		} catch (e) {
			onApiError(e);
		}
	};

	static submitPullRequestReview = async ([{ user, repository, number, username, event, comment }]: {
		user: string;
		repository: string;
		number: number;
		username: string;
		event: string;
		comment: string;
	}[]) => {
		try {
			const octokit = await getOctokit();
			// Fetch updated reviews
			const { data: reviews } = await octokit.pulls.listReviews({ owner: user, repo: repository, pull_number: number });
			// Find pending user review
			const pendingReview = find(reviews, r => r.state === 'PENDING' && r.user.login === username);
			let response;
			const apiEvent = event === 'CHANGES_REQUESTED' ? 'REQUEST_CHANGES' : event;
			if (pendingReview) {
				response = await octokit.pulls.submitReview({
					owner: user,
					repo: repository,
					pull_number: number,
					review_id: pendingReview.id,
					event: apiEvent,
					body: comment
				});
			} else {
				response = await octokit.pulls.createReview({
					owner: user,
					repo: repository,
					pull_number: number,
					event: apiEvent,
					body: comment
				});
			}
			return response.data.state;
		} catch (e) {
			onApiError(e);
			throw e;
		}
	};

	static mergePullRequest = async ([{ user, repository, number }]: {
		user: string;
		repository: string;
		number: number;
	}[]) => {
		try {
			const octokit = await getOctokit();
			const { data } = await octokit.pulls.merge({ owner: user, repo: repository, pull_number: number });
			return data.merged;
		} catch (e) {
			onApiError(e);
		}
	};

	static testUserToken = async (token: string) => {
		const octokit = await getOctokit({ token });
		await octokit.users.getAuthenticated();
	};
}

export default GithubApi;
