import React from 'react';
import { useToasts } from '@sergiogc9/react-ui';

import Storage from 'lib/Storage';
import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { ExtensionStatus } from 'types/Extension';

import ExtensionPopupHeader from './Header/ExtensionPopupHeader';
import ExtensionPopupPullRequests from './PullRequests/ExtensionPopupPullRequests';

import { StyledExtensionPopup } from './styled';

type Route = 'pullRequests';

const ExtensionPopup: React.FC = () => {
	const [route] = React.useState<Route>('pullRequests');
	const [status, setStatus] = React.useState<ExtensionStatus>('stop');

	const messageHandlers = React.useContext(MessageHandlersContext)!;

	const { addToast } = useToasts();

	React.useEffect(() => {
		messageHandlers.sendBackgroundMessage({ type: 'get_status' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'status') setStatus(message.data);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(() => {
		const checkStatus = async (currentStatus: ExtensionStatus) => {
			if (currentStatus === 'error') {
				if (!(await Storage.get('github_token'))) {
					addToast({
						key: 'github_token_not_available',
						message:
							'Github token not available! Please enter a valid token in settings page available in the sidebar.',
						status: 'error'
					});
				}
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
		<StyledExtensionPopup id="githubExtensionPopup">
			<ExtensionPopupHeader status={status} />
			{content}
		</StyledExtensionPopup>
	);
};

export default React.memo(ExtensionPopup);
