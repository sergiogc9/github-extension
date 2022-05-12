import React from 'react';
import { brands, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Icon, Text } from '@sergiogc9/react-ui';

import { useMessageHandlersContext } from 'components/Extension/Context/MessageContext';

import { StyledExtensionPopupHeader, StyledTabIcon, StyledTabLink } from './styled';
import { ExtensionPopupHeaderProps } from './types';

const ExtensionPopupHeader: React.FC<ExtensionPopupHeaderProps> = props => {
	const { onChangeRoute, route, status } = props;

	const [user, setUser] = React.useState<any>();

	const messageHandlers = useMessageHandlersContext()!;

	React.useEffect(() => {
		messageHandlers.sendBackgroundMessage({ type: 'get_user' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'user_updated') setUser(message.data);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const content = React.useMemo(() => {
		if (status === 'error') return null;
		if (status === 'starting' || !user) return 'Loading...';
		if (status === 'synced')
			return (
				<>
					<Icon.FontAwesome aspectSize="m" color="neutral.0" icon={brands('github')} />
					<Text color="neutral.0" ml={3}>
						{user.login}
					</Text>
					<StyledTabLink
						color="neutral.0"
						ml="auto"
						onClick={() => onChangeRoute('myPullRequests')}
						opacity={route === 'myPullRequests' ? 1 : 0.7}
					>
						My pull requests
					</StyledTabLink>
					<StyledTabLink
						color="neutral.0"
						ml={4}
						onClick={() => onChangeRoute('pullRequests')}
						opacity={route === 'pullRequests' ? 1 : 0.7}
					>
						All pull requests
					</StyledTabLink>
					<StyledTabIcon
						aspectSize="xs"
						color="neutral.0"
						cursor="pointer"
						icon={solid('gear')}
						ml={3}
						onClick={() => onChangeRoute('settings')}
					/>
				</>
			);
	}, [onChangeRoute, route, status, user]);

	return <StyledExtensionPopupHeader>{content}</StyledExtensionPopupHeader>;
};

export default React.memo(ExtensionPopupHeader);
