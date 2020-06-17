export type GithubPullRequest = {
    title: string,
    state: 'open' | 'closed',
    number: number,
    owner: string,
    repository: string,
    branches?: { base: string, head: string },
    user: { username: string }
}
