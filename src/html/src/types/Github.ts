type GithubLabel = {
	id: string;
	name: string;
	color: string;
};

export type GithubReview = {
	user: string;
	state: 'COMMENTED' | 'CHANGES_REQUESTED' | 'APPROVED' | 'PENDING';
	userImgUrl: string;
	date?: string; // Pending reviewers have no date
};
export type GithubReviews = Record<string, GithubReview>;

export type GithubChecks = {
	failed: number;
	neutral: number;
	pending: number;
	success: number;
};

export type GithubPullRequest = {
	updated_at: string;
	title: string;
	state: 'open' | 'closed';
	number: number;
	owner: string;
	repository: string;
	branches?: { base: string; head: string };
	user: { username: string };
	labels: GithubLabel[];
	additions: number;
	deletions: number;
	changedFiles: number;
	commits: number;
	comments: number;
	reviewComments: number;
	reviews?: GithubReviews;
	checks?: GithubChecks;
	merged?: boolean;
	mergeable?: boolean;
	mergeable_status?: 'clean' | 'blocked' | 'dirty';
};

export type GithubPullRequestChanges = {
	comments: number;
	commits: number;
	reviews: number;
};
