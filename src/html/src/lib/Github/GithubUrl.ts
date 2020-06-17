const githubUrlPrefix = 'https://github.com/';

export const getRepositoryUrl = (owner: string, name: string) => `${githubUrlPrefix}${owner}/${name}`;
export const getPullRequestUrl = (owner: string, name: string, number: number) => `${githubUrlPrefix}${owner}/${name}/pull/${number}`;
export const getUserUrl = (username: string) => `${githubUrlPrefix}${username}`;
