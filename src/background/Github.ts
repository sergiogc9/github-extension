import GithubApi from '@react/lib/Github/GithubApi';
import Extension from './Extension';
import { Message } from 'types/Message';
import { GithubPullRequest } from '@react/types/Github';

class Github {
    private __extension: Extension;
    private __pullRequests?: GithubPullRequest[];

    constructor(extension: Extension) {
        this.__extension = extension;
        this.__extension.getMessageHandler().addListener(this.__onMessage);
    }

    private __onMessage = (message: Message) => {
        if (message.type === 'get_pull_requests') this.fetchPullRequests();
    }

    public fetchPullRequests = async () => {
        this.__pullRequests = await GithubApi.getUserPullRequests();
        this.__extension.getMessageHandler().sendMessage({ type: 'pull_requests_updated', data: this.__pullRequests });
    }
}

export default Github;
