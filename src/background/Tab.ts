import { Message, MessageSendResponse } from 'types/Message';

import extensionMessageHandler from './MessageHandler';

class Tab {
	public init = () => {
		extensionMessageHandler.addListener(this.__onMessage);

		chrome.tabs.onUpdated.addListener((eventTabId, change, tab) => {
			chrome.tabs.sendMessage(eventTabId, {
				type: 'tab_updated',
				data: { change, tab }
			});
		});
	};

	private __onMessage = async (
		message: Message,
		sender: chrome.runtime.MessageSender,
		sendResponse: MessageSendResponse
	) => {
		const { type, data } = message;

		if (type === 'tab_helper') {
			if (data.action === 'get_current') sendResponse({ id: sender.tab?.id, url: sender.tab?.url });
			else if (data.action === 'update_tab') chrome.tabs.update(sender.tab.id, { url: data.url });
			else if (data.action === 'create_tab') chrome.tabs.create({ url: data.url });
			else if (data.action === 'send_data') chrome.tabs.sendMessage(sender.tab.id, data.message);
		}
	};
}

export default new Tab();
