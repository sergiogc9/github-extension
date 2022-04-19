import React from 'react';
import { brands } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Icon, Text } from '@sergiogc9/react-ui';

import { useMessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { ExtensionStatus } from 'types/Extension';

import { StyledExtensionPopupHeader, StyledTabLink } from './styled';

type ComponentProps = {
	status: ExtensionStatus;
};

const ExtensionPopupHeader: React.FC<ComponentProps> = props => {
	const { status } = props;

	const [user, setUser] = React.useState<any>();

	const messageHandlers = useMessageHandlersContext()!;

	React.useEffect(() => {
		messageHandlers.sendBackgroundMessage({ type: 'get_user' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'user_updated') setUser(message.data);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const content = React.useMemo(() => {
		if (status === 'starting' || !user) return 'Loading...';
		if (status === 'synced')
			return (
				<>
					<Icon.FontAwesome aspectSize="m" color="neutral.0" icon={brands('github')} />
					<Text color="neutral.0" ml={3}>
						{user.login}
					</Text>
					<StyledTabLink color="neutral.0" ml="auto">
						Pull requests
					</StyledTabLink>
				</>
			);
	}, [status, user]);

	return <StyledExtensionPopupHeader>{content}</StyledExtensionPopupHeader>;
};

export default React.memo(ExtensionPopupHeader);
