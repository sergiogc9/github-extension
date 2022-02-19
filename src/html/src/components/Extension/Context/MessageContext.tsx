import React from 'react';
import { Message, MessageHandler, MessageSendResponse } from 'types/Message';

export type MessageHandlers = {
	sendContentScriptMessage: (message: Message, sendResponse?: MessageSendResponse) => void;
	onBackgroundMessage: (handler: MessageHandler) => void;
	sendBackgroundMessage: (message: Message, sendResponse?: MessageSendResponse) => void;
};

export const MessageHandlersContext = React.createContext<MessageHandlers | null>(null);
