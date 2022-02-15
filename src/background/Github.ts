import moment from 'moment';
import assign from 'lodash/assign';
import size from 'lodash/size';
import transform from 'lodash/transform';
import filter from 'lodash/filter';
import values from 'lodash/values';

import GithubApi from '@react/lib/Github/GithubApi';
import Storage from '@react/lib/Storage';
import { GithubPullRequest, GithubPullRequestChanges, GithubReview } from '@react/types/Github';
import { Message, MessageSendResponse } from 'types/Message';
import Extension from './Extension';

type CachedPullRequestData = {
    pullRequest: GithubPullRequest,
    viewedPullRequest?: GithubPullRequest,
    changes: GithubPullRequestChanges
};

class Github {
    private __extension: Extension;
    private __pullRequests?: GithubPullRequest[];
    private __cachedPullRequestsData: Record<string, CachedPullRequestData>;

    constructor(extension: Extension) {
        this.__extension = extension;
        this.__extension.getMessageHandler().addListener(this.__onMessage);
        this.__cachedPullRequestsData = {};
        this.__loadCachedPullRequestData();
    }

    public fetchPullRequests = async () => {
        const username = this.__extension.getUser().getData().login;
        this.__sendPullRequestsLoading();
        const userPullRequests = await GithubApi.getUserPullRequests(username);
        await this.__retrievePullRequestsFromUserPullRequests(userPullRequests);
        this.__sendPullRequests();
    }

    private __onMessage = (message: Message, sender, sendResponse: MessageSendResponse) => {
        if (message.type === 'get_pull_requests') {
            if (this.__pullRequests) this.__sendPullRequests();
            this.fetchPullRequests();
        }
        else if (message.type === 'pull_request_seen') {
            const cachedPr = this.__cachedPullRequestsData[this.__getCachePullRequestKey(message.data)]
            if (cachedPr) {
                cachedPr.viewedPullRequest = message.data;
                cachedPr.changes = { comments: 0, commits: 0, reviews: 0 };
                this.__saveCachedPullRequestData();
                this.__extension.getMessageHandler().sendMessageToAll({ type: 'pull_request_changes', data: this.__getPullRequestsChangesObject() })
            }
        }
        else if (message.type === 'get_pull_request_changes') {
            if (sendResponse) sendResponse(this.__getPullRequestChanges(message.data));
        }
    }

    private __getCachePullRequestKey = (pr: GithubPullRequest) => `${pr.owner}-${pr.repository}-${pr.number}`;

    private __getUpdatedReviews = (pr: GithubPullRequest, viewedPullRequest?: GithubPullRequest) => {
        if (!viewedPullRequest) return filter(values(pr.reviews), (review: GithubReview) => review.state !== 'PENDING');
        return filter(values(pr.reviews), (review: GithubReview) => review.state !== 'PENDING' && review.date !== viewedPullRequest.reviews[review.user]?.date);
    }

    private __loadCachedPullRequestData = async () => {
        this.__cachedPullRequestsData = await Storage.get('user_pull_requests') || {};
    }

    private __saveCachedPullRequestData = async () => {
        await Storage.set('user_pull_requests', this.__cachedPullRequestsData);
    }

    private __getPullRequestsChangesObject = (): Record<string, GithubPullRequestChanges> => {
        return transform(this.__pullRequests, (result, pr) => result[this.__getCachePullRequestKey(pr)] = this.__getPullRequestChanges(pr), {});
    }

    private __getPullRequestChanges = (pullRequest: GithubPullRequest) => {
        const cachedPRData = this.__cachedPullRequestsData[this.__getCachePullRequestKey(pullRequest)];
        return cachedPRData && cachedPRData.changes;
    }

    private __updatePullRequestChanges = (pullRequest: GithubPullRequest): GithubPullRequestChanges => {
        const previousPRStatus: GithubPullRequestChanges = { comments: 0, commits: 0, reviews: 0 };
        const cachedPRData = this.__cachedPullRequestsData[this.__getCachePullRequestKey(pullRequest)];
        if (cachedPRData && cachedPRData.viewedPullRequest) {
            previousPRStatus.comments = cachedPRData.viewedPullRequest.comments + cachedPRData.viewedPullRequest.reviewComments;
            previousPRStatus.commits = cachedPRData.viewedPullRequest.commits;
        }
        return {
            comments: (pullRequest.comments + pullRequest.reviewComments) - previousPRStatus.comments,
            commits: pullRequest.commits - previousPRStatus.commits,
            reviews: size(this.__getUpdatedReviews(pullRequest, cachedPRData?.viewedPullRequest)),
        }
    };

    private __getPullRequest = async (userPullRequest: GithubPullRequest) => {
        const cachedPRData = this.__cachedPullRequestsData[this.__getCachePullRequestKey(userPullRequest)];
        // Return cached pull request if it is not updated
        if (cachedPRData) {
            if (moment(cachedPRData.pullRequest.updated_at) >= moment(userPullRequest.updated_at)) return cachedPRData.pullRequest;
        }

        // If updated, fetch it again and update updated values
        const { owner: user, repository, number } = userPullRequest;
        const pullRequest = await GithubApi.getPullRequestInfo({ data: { user, repository, number } });
        const changes = this.__updatePullRequestChanges(pullRequest);
        if (cachedPRData) assign(cachedPRData, { pullRequest, changes });
        else this.__cachedPullRequestsData[this.__getCachePullRequestKey(userPullRequest)] = { pullRequest, changes };

        return pullRequest;
    }

    private __retrievePullRequestsFromUserPullRequests = async (userPullRequests: GithubPullRequest[]) => {
        await this.__loadCachedPullRequestData();
        this.__pullRequests = await Promise.all(userPullRequests.map(this.__getPullRequest));
        await this.__saveCachedPullRequestData();

    }

    private __sendPullRequestsLoading = () => this.__extension.getMessageHandler().sendMessageToAll({ type: 'pull_requests_loading' });
    private __sendPullRequests = () => this.__extension.getMessageHandler().sendMessageToAll({
        type: 'pull_requests_updated',
        data: {
            pullRequests: this.__pullRequests,
            changes: this.__getPullRequestsChangesObject()
        }
    });
}

export default Github;
