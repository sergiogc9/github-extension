import React from 'react';

type AlertType = 'default' | 'info' | 'success' | 'warning' | 'error';
type Alert = { type: AlertType; message: string; persist?: boolean };

export type AlertHandlers = {
	addNotification: (alert: Alert) => void;
	onGithubApiError: (error: Error) => void;
};

export const AlertContext = React.createContext<AlertHandlers | null>(null);
