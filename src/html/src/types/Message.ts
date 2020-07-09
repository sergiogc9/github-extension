export type MessageType = 'tab_helper' | 'sidebar_status' | 'get_status' | 'status' | 'get_user' | 'user_updated' | 'get_pull_requests' | 'pull_requests_updated' | 'token_updated';
export type Message = { type: MessageType, data?: any };
export type MessageHandler = (message: Message, sender?: chrome.runtime.MessageSender, sendResponse?: (data: any) => void) => void;
