import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { ExtensionStatus } from 'types/Extension';

import './ExtensionPopupHeader.scss';

type ComponentProps = {
	status: ExtensionStatus
}

const ExtensionPopupHeader: React.FC<ComponentProps> = props => {
	const { status } = props;

	const [user, setUser] = React.useState<any>();

	const messageHandlers = React.useContext(MessageHandlersContext)!;

	React.useEffect(() => {
		messageHandlers.sendBackgroundMessage({ type: 'get_user' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'user_updated') setUser(message.data);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const content = React.useMemo(() => {
		if (status === 'starting' || !user) return 'Loading...';
		if (status === 'synced') return (
			<>
				<FontAwesomeIcon icon={['fab', 'github']} />
				<span>{user.login}</span>
			</>
		);
	}, [status, user]);

	return (
		<div id="githubExtensionPopupHeader">
			{content}
		</div>
	);
};

export default React.memo(ExtensionPopupHeader);
