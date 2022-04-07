import React from 'react';
import { Text } from '@sergiogc9/react-ui';

import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { ExtensionStatus } from 'types/Extension';

import { StyledExtensionPopupHeader, StyledGithubIcon, StyledTabLink } from './styled';

type ComponentProps = {
	status: ExtensionStatus;
};

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
		if (status === 'synced')
			return (
				<>
					<StyledGithubIcon name="github" type="brand" />
					<Text color="neutral.0">{user.login}</Text>
					<StyledTabLink color="neutral.0" ml="auto">
						Pull requests
					</StyledTabLink>
				</>
			);
	}, [status, user]);

	return <StyledExtensionPopupHeader>{content}</StyledExtensionPopupHeader>;
};

export default React.memo(ExtensionPopupHeader);
