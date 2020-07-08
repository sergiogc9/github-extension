import { Message } from '@react/types/Message';
import Tab from './Tab';
import User from './User';
import Github from './Github';
import MessageHandler from './MessageHandler';
import { ExtensionStatus } from '@react/types/Extension';

class Extension {
    private __status: ExtensionStatus = 'stop';
    private __messageHandler;
    private __user;
    private __github;
    private __tab;

    private __onMessage = (message: Message) => {
        if (message.type === 'get_status') this.__sendStatus();
    }

    private __sendStatus = () => this.__messageHandler.sendMessage({ type: 'status', data: this.__status });

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

    public async init() {
        this.__messageHandler = new MessageHandler();
        this.__user = new User(this);
        this.__github = new Github(this);
        this.__tab = new Tab(this);

        this.__messageHandler.addListener(this.__onMessage);
        this.__status = 'starting';
        this.__sendStatus();
        await Promise.all([
            this.__user.fetch()
        ]);
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.__updateStatus();
    }

    public getUser = () => this.__user;
    public getMessageHandler = () => this.__messageHandler;
}

export default Extension;
