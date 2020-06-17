import React from 'react';

import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { ExtensionStatus } from 'types/Extension';
import { FontAwesomeIcon } from 'components/common/Icon/Icon';

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
				<FontAwesomeIcon name='github' type='brand' />
				<span>{user.login}</span>
				<div className='header-options'>
					<span>Pull requests</span>
				</div>
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
