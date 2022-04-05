import React from 'react';
import { useTheme } from 'styled-components';
import { Alert, Button, CheckBox, Divider, Flex, TextField, Title, useToasts } from '@sergiogc9/react-ui';
import { getColorByMode } from '@sergiogc9/react-ui-theme';

import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { StorageContext, StorageHandlerContext } from 'components/Extension/Context/StorageContext';

const ExtensionSettings: React.FC = () => {
	const storageData = React.useContext(StorageContext)!;
	const storageHandlers = React.useContext(StorageHandlerContext)!;
	const messageHandlers = React.useContext(MessageHandlersContext)!;

	const { addToast } = useToasts();

	const theme = useTheme();

	return (
		<Flex id="githubExtensionAppSettings" flexDirection="column" flexGrow={1} overflow="hidden">
			<Flex
				alignItems="center"
				borderBottom="thin solid"
				borderBottomColor={getColorByMode(theme, { light: 'neutral.100', dark: 'neutral.600' })}
				height={60}
				p={3}
			>
				<Title aspectSize="subtle">Settings</Title>
			</Flex>
			<Flex flexDirection="column" flexGrow={1} overflowY="auto">
				<Flex rowGap={2} flexDirection="column" p={3}>
					<Title aspectSize="uppercase" color="neutral.400">
						github token
					</Title>

					<TextField
						aspectSize="s"
						defaultValue={storageData.token}
						placeholder="Enter github token"
						onBlur={ev => {
							storageHandlers.setStorageItem('github_token', ev.target.value);
							messageHandlers.sendBackgroundMessage({
								type: 'token_updated'
							});
						}}
					/>
					<Alert p={2}>
						<Alert.Icon />
						<Alert.Text aspectSize="s">Token is saved only in browser local storage.</Alert.Text>
					</Alert>
				</Flex>
				<Divider px={3} />
				<Flex flexDirection="column" rowGap={2} p={3}>
					<Title aspectSize="uppercase" color="neutral.400">
						Options
					</Title>
					<CheckBox
						description="Joins empty folders in a unique folder reducing the directory tree size."
						isSelected={storageData.hide_unimplemented_pages}
						label="Hide sidebar if page is not implemented"
						onChange={() =>
							storageHandlers.setStorageItem('hide_unimplemented_pages', !storageData.hide_unimplemented_pages)
						}
					/>
					<CheckBox
						description="Joins empty folders in a unique folder reducing the directory tree size."
						isSelected={storageData.group_folders}
						label="Group empty folders"
						onChange={() => storageHandlers.setStorageItem('group_folders', !storageData.group_folders)}
					/>
					<CheckBox
						description="Speed up big repositories. Enabling this option prevents loading the whole tree at first, then searching
						will only find loaded folders and files."
						isSelected={storageData.lazy_load_tree}
						label="Lazy load code trees"
						onChange={() => storageHandlers.setStorageItem('lazy_load_tree', !storageData.lazy_load_tree)}
					/>
				</Flex>
				<Divider px={3} />
				<Flex justifyContent="center" p={3}>
					<Button
						aspectSize="s"
						minWidth={120}
						my={2}
						onClick={() => {
							addToast({ key: 'settings-saved', message: 'Settings saved', status: 'success' });
						}}
						width="50%"
					>
						Apply settings
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default React.memo(ExtensionSettings);
