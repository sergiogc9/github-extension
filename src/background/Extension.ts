import { ExtensionStatus } from '@html/types/Extension';
import { Message } from '@html/types/Message';

import extensionGithub from './Github';
import extensionMessageHandler from './MessageHandler';
import extensionTab from './Tab';
import extensionUser from './User';

class Extension {
	private __status: ExtensionStatus = 'stop';

	private __onMessage = (message: Message) => {
		if (message.type === 'get_status') this.__sendStatus();
		else if (message.type === 'token_updated') this.__updateUserStatus();
	};

	private __sendStatus = () =>
		extensionMessageHandler.sendMessageToAll({
			type: 'status',
			data: this.__status
		});

	private __updateStatus = () => {
		let status = this.__status;
		if (extensionUser.getData()) status = 'synced';
		else status = 'error';
		if (status !== this.__status) {
			this.__status = status;
			this.__sendStatus();
			if (status === 'synced') extensionGithub.fetchPullRequests();
		}
	};

	private async __updateUserStatus() {
		await Promise.all([extensionUser.fetch()]);
		this.__updateStatus();
	}

	public async init() {
		extensionMessageHandler.init();
		extensionGithub.init();
		extensionTab.init();
		extensionUser.init();

		extensionMessageHandler.addListener(this.__onMessage);
		this.__status = 'starting';
		this.__sendStatus();
		await this.__updateUserStatus();
	}
}

export default Extension;
