import React from 'react';
import { Box, useToasts } from '@sergiogc9/react-ui';

import Storage from 'lib/Storage';
import { useMessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { ExtensionStatus } from 'types/Extension';

import ExtensionSettings from '../Settings/ExtensionSettings';
import ExtensionWelcome from '../Welcome/ExtensionWelcome';
import ExtensionPopupHeader from './Header/ExtensionPopupHeader';
import ExtensionPopupPullRequests from './PullRequests/ExtensionPopupPullRequests';

import { StyledExtensionPopup } from './styled';
import { PopupRoute } from './types';

const POPUP_ROUTE_STORAGE_KEY = 'popup_selected_route';

const ExtensionPopup: React.FC = () => {
	const [route, setRoute] = React.useState<PopupRoute>('pullRequests');
	const [status, setStatus] = React.useState<ExtensionStatus>('stop');
	const [isGithubTokenError, setIsGithubTokenError] = React.useState(false);

	const messageHandlers = useMessageHandlersContext()!;

	const { addToast } = useToasts();

	React.useEffect(() => {
		const setupSavedRoute = async () => {
			const savedRoute = await Storage.get(POPUP_ROUTE_STORAGE_KEY);
			setRoute(savedRoute ?? 'pullRequests');
		};
		setupSavedRoute();

		messageHandlers.sendBackgroundMessage({ type: 'get_status' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'status') setStatus(message.data);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(() => {
		const checkStatus = async (currentStatus: ExtensionStatus) => {
			if (currentStatus === 'error') {
				if (!(await Storage.get('github_token'))) {
					setIsGithubTokenError(true);
				}
				// eslint-disable-next-line no-alert
				else {
					addToast({
						aspectSize: 's',
						duration: 'always',
						key: 'general_error',
						message: 'Some error ocurred, please try again later or reinstall the extension.',
						status: 'error'
					});
				}
			} else setIsGithubTokenError(false);
		};
		checkStatus(status);
	}, [status]); // eslint-disable-line react-hooks/exhaustive-deps

	const content = React.useMemo(() => {
		if (isGithubTokenError) return <ExtensionWelcome />;
		if (status === 'synced') {
			if (route === 'pullRequests') return <ExtensionPopupPullRequests />;
			if (route === 'settings')
				return (
					<Box overflowY="auto">
						<ExtensionSettings />
					</Box>
				);
		}
	}, [isGithubTokenError, status, route]);

	const onChangeRoute = React.useCallback((newRoute: PopupRoute) => {
		if (newRoute !== 'settings') Storage.set(POPUP_ROUTE_STORAGE_KEY, newRoute);
		setRoute(newRoute);
	}, []);

	return (
		<StyledExtensionPopup id="githubExtensionPopup">
			<ExtensionPopupHeader onChangeRoute={onChangeRoute} status={status} />
			{content}
		</StyledExtensionPopup>
	);
};

export default React.memo(ExtensionPopup);
