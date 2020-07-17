import React from 'react';
import { MessageHandler } from 'types/Message';

export type MessageHandlers = {
    sendContentScriptMessage: MessageHandler,
    onBackgroundMessage: (handler: MessageHandler) => void,
    sendBackgroundMessage: MessageHandler
};

export const MessageHandlersContext = React.createContext<MessageHandlers | null>(null);
