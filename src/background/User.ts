import GithubApi from '../html/src/lib/Github/GithubApi';
import messageHandler from './MessageHandler';
import { Message } from '../html/src/components/Extension/Context/MessageContext';

class User {
    private __attributes?: Record<string, any>;

    constructor() {
        messageHandler.addListener(this.__onMessage);
    }

    private __onMessage = (message: Message) => {
        if (message.type === 'get_user') this.__sendUser();
    }

    private __sendUser = () => messageHandler.sendMessage({ type: 'user_updated', data: this.__attributes });

    public fetch = async () => {
        this.__attributes = await GithubApi.getUserData();
        this.__sendUser();
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
