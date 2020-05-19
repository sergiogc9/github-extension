export type MessageType = 'get_status' | 'status' | 'get_user' | 'user_updated';
export type Message = { type: MessageType, data?: any };
export type MessageHandler = (message: Message) => void;
