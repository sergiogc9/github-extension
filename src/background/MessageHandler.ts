import { Message, MessageHandler as MessageHandlerType } from '@react/types/Message';

class MessageHandler {

    private __listeners: MessageHandlerType[] = [];

    constructor() {
        this.__initMessageHandlers();
    }

    private __initMessageHandlers = () => {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log('Message received: ', message);
            for (const listener of this.__listeners) listener(message, sender, sendResponse);
        });
    }

    public addListener = (listener: MessageHandlerType) => {
        this.__listeners.push(listener);
    }

    public sendMessage = (tabId, message: Message) => {
        console.log(`Sending message to tabId ${tabId}:`, message);
        chrome.tabs.sendMessage(tabId, message);
    };

    public sendMessageToAll = (message: Message) => {
        console.log('Sending message to all:', message);
        chrome.tabs.query({}, tabs => tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, message)));
    };
}

export default MessageHandler;
