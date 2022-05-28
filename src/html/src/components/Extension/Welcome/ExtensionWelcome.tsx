import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Alert, Button, Flex, Icon, Text, Title, useToasts } from '@sergiogc9/react-ui';

import GithubInput from 'components/common/ui/Input/GithubInput';
import { useMessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { useStorageContext, useStorageHandlerContext } from 'components/Extension/Context/StorageContext';
import GithubApi from 'lib/Github/GithubApi';

const ExtensionWelcome = () => {
	const storageData = useStorageContext()!;
	const storageHandlers = useStorageHandlerContext()!;
	const messageHandlers = useMessageHandlersContext()!;

	const [token, setToken] = React.useState(storageData.token ?? '');

	const { addToast } = useToasts();

	const onSaveToken = React.useCallback(async () => {
		try {
			await GithubApi.testUserToken(token);
			storageHandlers.setStorageItem('github_token', token);
			messageHandlers.sendBackgroundMessage({
				type: 'token_updated'
			});
			addToast({
				aspectSize: 's',
				key: 'token_saved',
				message: 'The token has been saved',
				status: 'success'
			});
		} catch (e) {
			addToast({
				aspectSize: 's',
				key: 'token_not_valid',
				message: 'The token is not valid',
				status: 'error'
			});
		}
	}, [addToast, messageHandlers, storageHandlers, token]);

	return (
		<Flex flexDirection="column" flexGrow={1} rowGap={3} overflow="hidden" p={3}>
			<Title aspectSize="subtle">
				Thanks for using the Fox Github Extension
				<Icon.FontAwesome aspectSize="s" color="red.400" icon={solid('heart')} ml={2} bounce />
			</Title>
			<Text aspectSize="s">
				The extension needs a Github token in order to work. Please fill it in the input below:
			</Text>
			<GithubInput
				height={30}
				inputProps={{
					onChange: ev => setToken(ev.target.value),
					placeholder: 'Enter github token',
					value: token
				}}
				leftContent={<Icon.FontAwesome aspectSize="xs" icon={solid('key')} />}
			/>
			<Alert aspectSize="s" borderRadius={0}>
				<Alert.Icon />
				<Flex flexDirection="column">
					<Alert.Text>
						This extension only requires the <Alert.Text fontWeight="bold">repo scope</Alert.Text> to be selected in the
						token settings.
					</Alert.Text>
					<Alert.Text>
						Token is <Alert.Text fontWeight="bold">saved locally</Alert.Text>, this extension does not use any backend
						other than the official Github API.
					</Alert.Text>
				</Flex>
			</Alert>
			<Button
				aspectSize="s"
				isDisabled={isEmpty(token)}
				maxWidth={300}
				margin="0 auto"
				onClick={onSaveToken}
				variant="primary"
				width="100%"
			>
				Save token
			</Button>
		</Flex>
	);
};

export default React.memo(ExtensionWelcome);
