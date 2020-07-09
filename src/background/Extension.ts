import { Message } from '@react/types/Message';
import Tab from './Tab';
import User from './User';
import Github from './Github';
import MessageHandler from './MessageHandler';
import { ExtensionStatus } from '@react/types/Extension';

class Extension {
    private __status: ExtensionStatus = 'stop';
    private __messageHandler: MessageHandler;
    private __user: User;
    private __github: Github;
    private __tab: Tab;

    private __onMessage = (message: Message) => {
        if (message.type === 'get_status') this.__sendStatus();
        else if (message.type === 'token_updated') this.__updateUserStatus();
    }

    private __sendStatus = () => this.__messageHandler.sendMessageToAll({ type: 'status', data: this.__status });

    private __updateStatus = () => {
        let status = this.__status;
        if (this.__user.getData()) status = 'synced';
        else status = 'error';
        if (status !== this.__status) {
            this.__status = status;
            this.__sendStatus();
            if (status === 'synced') this.__github.fetchPullRequests();
        }
    }

    private async __updateUserStatus() {
        await Promise.all([
            this.__user.fetch()
        ]);
        this.__updateStatus();
    }

    public async init() {
        this.__messageHandler = new MessageHandler();
        this.__user = new User(this);
        this.__github = new Github(this);
        this.__tab = new Tab(this);

        this.__messageHandler.addListener(this.__onMessage);
        this.__status = 'starting';
        this.__sendStatus();
        await this.__updateUserStatus();
    }

    public getUser = () => this.__user;
    public getMessageHandler = () => this.__messageHandler;
}

export default Extension;
