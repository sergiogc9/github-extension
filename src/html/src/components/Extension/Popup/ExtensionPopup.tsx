import React from 'react';

import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { ExtensionStatus } from 'types/Extension';
import ExtensionPopupHeader from './Header/ExtensionPopupHeader';

import './ExtensionPopup.scss';
import ExtensionPopupPullRequests from './PullRequests/ExtensionPopupPullRequests';

type Route = 'pullRequests';

const ExtensionPopup: React.FC = props => {
	const [route, setRoute] = React.useState<Route>('pullRequests');
	const [status, setStatus] = React.useState<ExtensionStatus>('stop');

	const messageHandlers = React.useContext(MessageHandlersContext)!;

	React.useEffect(() => {
		messageHandlers.sendBackgroundMessage({ type: 'get_status' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'status') setStatus(message.data);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const content = React.useMemo(() => {
		if (status === 'synced'){
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
