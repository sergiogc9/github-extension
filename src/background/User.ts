import GithubApi from '@react/lib/Github/GithubApi';
import Extension from './Extension';
import { Message } from 'types/Message';

class User {
    private __extension: Extension;
    private __attributes?: Record<string, any>;

    constructor(extension: Extension) {
        this.__extension = extension;
        this.__extension.getMessageHandler().addListener(this.__onMessage);
    }

    private __onMessage = (message: Message) => {
        if (message.type === 'get_user') this.__sendUser();
    }

    private __sendUser = () => this.__extension.getMessageHandler().sendMessageToAll({ type: 'user_updated', data: this.__attributes });

    public fetch = async () => {
        try {
            this.__attributes = await GithubApi.getUserData();
            this.__sendUser();
        } catch (e) { }
    }

    public getData = () => {
        return this.__attributes;
    }

    public get = (key: string) => {
        if (!this.__attributes) return null;
        return this.__attributes[key];
    }
}

export default User;
