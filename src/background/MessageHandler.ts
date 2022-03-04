import Log from '@html/lib/Log';
import { Message, MessageHandler as MessageHandlerType } from '@html/types/Message';

class MessageHandler {
	private __listeners: MessageHandlerType[] = [];

	public init = () => {
		this.__initMessageHandlers();
	};

	public addListener = (listener: MessageHandlerType) => {
		this.__listeners.push(listener);
	};

	public sendMessage = (tabId, message: Message) => {
		Log.info(`Sending message to tabId ${tabId}:`, message);
		chrome.tabs.sendMessage(tabId, message);
	};

	public sendMessageToAll = (message: Message) => {
		Log.info('Sending message to all:', message);
		chrome.tabs.query({}, tabs => tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, message)));
		chrome.runtime.sendMessage(message);
	};

	private __initMessageHandlers = () => {
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			Log.info('Message received: ', message);
			// eslint-disable-next-line no-restricted-syntax
			for (const listener of this.__listeners) listener(message, sender, sendResponse);
		});
	};
}

export default new MessageHandler();
