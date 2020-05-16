import React from 'react';

export type Message = { type: MessageType, data?: any };
export type MessageType = 'get_status' | 'status' | 'get_user' | 'user_updated';
export type MessageHandler = (message: Message) => void;

export type MessageHandlers = { onBackgroundMessage: (handler: MessageHandler) => void, sendBackgroundMessage: MessageHandler };

export const MessageHandlersContext = React.createContext<MessageHandlers | null>(null);
