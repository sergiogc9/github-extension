import React from 'react';

import Storage from 'lib/Storage';
import { AlertContext } from 'components/Extension/Context/AlertContext';
import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { ExtensionStatus } from 'types/Extension';

import ExtensionPopupHeader from './Header/ExtensionPopupHeader';
import ExtensionPopupPullRequests from './PullRequests/ExtensionPopupPullRequests';

import './ExtensionPopup.scss';

type Route = 'pullRequests';

const ExtensionPopup: React.FC = () => {
	const [route] = React.useState<Route>('pullRequests');
	const [status, setStatus] = React.useState<ExtensionStatus>('stop');

	const messageHandlers = React.useContext(MessageHandlersContext)!;
	const alertHandlers = React.useContext(AlertContext)!;

	React.useEffect(() => {
		messageHandlers.sendBackgroundMessage({ type: 'get_status' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'status') setStatus(message.data);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(() => {
		const checkStatus = async (currentStatus: ExtensionStatus) => {
			if (currentStatus === 'error') {
				if (!(await Storage.get('github_token')))
					alertHandlers.addNotification({
						type: 'error',
						message: 'Github token not available! Please enter a valid token in settings page available in the sidebar.'
					});
				// eslint-disable-next-line no-alert
				else alert('Some error ocurred, please try again later or reinstall the extension.');
			}
		};
		checkStatus(status);
	}, [status]); // eslint-disable-line react-hooks/exhaustive-deps

	const content = React.useMemo(() => {
		if (status === 'synced') {
			if (route === 'pullRequests') return <ExtensionPopupPullRequests />;
		}
	}, [status, route]);

	return (
		<div id="githubExtensionPopup">
			<ExtensionPopupHeader status={status} />
			{content}
		</div>
	);
};

export default React.memo(ExtensionPopup);
