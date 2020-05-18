import { Message, MessageHandler as MessageHandlerType } from '@react/types/Message';

class MessageHandler {

    private __listeners: MessageHandlerType[] = [];

    constructor() {
        this.__initMessageHandlers();
    }

    private __initMessageHandlers = () => {
        chrome.runtime.onMessage.addListener((message, sender) => {
            console.log('Message received: ', message);
            for (const listener of this.__listeners) listener(message);
        });
    }

    public addListener = (listener: MessageHandlerType) => {
        this.__listeners.push(listener);
    }

    public sendMessage = (message: Message) => {
        console.log('Sending message:', message);
        chrome.runtime.sendMessage(message);
    };
}

export default new MessageHandler();
