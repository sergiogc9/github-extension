export type MessageType =
	| 'tab_helper'
	| 'sidebar_status'
	| 'get_status'
	| 'status'
	| 'get_user'
	| 'user_updated'
	| 'get_pull_requests'
	| 'pull_requests_loading'
	| 'pull_requests_updated'
	| 'pull_request_seen'
	| 'get_pull_request_changes'
	| 'pull_request_changes'
	| 'token_updated'
	| 'tab_updated';
export type Message = { type: MessageType; data?: any };
export type MessageHandler = (
	message: Message,
	sender?: chrome.runtime.MessageSender,
	sendResponse?: MessageSendResponse
) => void;
export type MessageSendResponse = (data: any) => void;
