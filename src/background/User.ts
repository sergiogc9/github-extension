import GithubApi from '@html/lib/Github/GithubApi';
import Log from '@html/lib/Log';

import { Message } from 'types/Message';

import extensionMessageHandler from './MessageHandler';

class User {
	private __attributes?: Record<string, any>;

	public init = () => {
		extensionMessageHandler.addListener(this.__onMessage);
	};

	public fetch = async () => {
		try {
			this.__attributes = undefined;
			this.__attributes = await GithubApi.getUserData();
			this.__sendUser();
		} catch (e) {
			Log.error(e);
		}
	};

	public getData = () => {
		return this.__attributes;
	};

	public get = (key: string) => {
		if (!this.__attributes) return null;
		return this.__attributes[key];
	};

	private __onMessage = (message: Message) => {
		if (message.type === 'get_user') this.__sendUser();
	};

	private __sendUser = () =>
		extensionMessageHandler.sendMessageToAll({ type: 'user_updated', data: this.__attributes });
}

export default new User();
