import React from 'react';
import { useSnackbar } from 'notistack';

import { AlertContext, AlertHandlers } from 'components/Extension/Context/AlertContext';

import './ExtensionAlertManager.scss';

type ComponentProps = {
	children: React.ReactNode;
};

const ExtensionAlertManager: React.FC<ComponentProps> = props => {
	const { children } = props;

	const { enqueueSnackbar } = useSnackbar();

	const handlers: AlertHandlers = React.useMemo(() => {
		return {
			addNotification: alert =>
				enqueueSnackbar(alert.message, {
					variant: alert.type,
					persist: alert.persist
				}),
			onGithubApiError: error =>
				enqueueSnackbar(error.message, {
					variant: 'error',
					preventDuplicate: true
				})
		};
	}, [enqueueSnackbar]);

	return <AlertContext.Provider value={handlers}>{children}</AlertContext.Provider>;
};

export default React.memo(ExtensionAlertManager);
