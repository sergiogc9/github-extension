import { Message } from '@react/components/Extension/Context/MessageContext';
import User from './User';
import messageHandler from './MessageHandler';

export type ExtensionStatus = 'stop' | 'starting' | 'synced' | 'error';

class Extension {
    private __status: ExtensionStatus = 'stop';
    private __user: User = new User();

    private __onMessage = (message: Message) => {
        if (message.type === 'get_status') this.__sendStatus();
    }

    private __sendStatus = () => messageHandler.sendMessage({ type: 'status', data: this.__status });

    private __updateStatus = () => {
        let status = this.__status;
        if (this.__user.getData()) status = 'synced';
        else status = 'error';
        if (status !== this.__status) {
            this.__status = status;
            this.__sendStatus();
        }
    }

    public async init() {
        messageHandler.addListener(this.__onMessage);
        this.__status = 'starting';
        this.__sendStatus();
        await Promise.all([
            this.__user.fetch()
        ]);
        await new Promise(resolve => setTimeout(resolve, 5000));
        this.__updateStatus();
    }
}

export default Extension;
