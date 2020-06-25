type GithubLabel = {
    id: string,
    name: string,
    color: string
};

export type GithubPullRequest = {
    title: string,
    state: 'open' | 'closed',
    number: number,
    owner: string,
    repository: string,
    branches?: { base: string, head: string },
    user: { username: string },
    labels: GithubLabel[],
    additions: number,
    deletions: number,
    changedFiles: number,
    commits: number,
    comments: number
    reviewComments: number
}
