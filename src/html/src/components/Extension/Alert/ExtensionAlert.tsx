import React from 'react';
import { SnackbarProvider } from 'notistack';

import ExtensionAlertManager from './ExtensionAlertManager';

type ComponentProps = {
	children: React.ReactNode;
};

const ExtensionAlert: React.FC<ComponentProps> = props => {
	const { children } = props;

	return (
		<SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} dense>
			<ExtensionAlertManager>{children}</ExtensionAlertManager>
		</SnackbarProvider>
	);
};

export default React.memo(ExtensionAlert);
