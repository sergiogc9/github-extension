import React from 'react';
import { Button, CheckBox, Divider, Flex, Title, useToasts } from '@sergiogc9/react-ui';

import { useMessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { useStorageContext, useStorageHandlerContext } from 'components/Extension/Context/StorageContext';

const ExtensionSettings: React.FC = () => {
	const storageData = useStorageContext()!;
	const storageHandlers = useStorageHandlerContext()!;
	const messageHandlers = useMessageHandlersContext()!;

	const { addToast } = useToasts();

	return (
		<Flex flexDirection="column" flexGrow={1} overflow="hidden">
			<Flex
				alignItems="center"
				bg="github.sidebar.header"
				borderBottom="thin solid"
				borderBottomColor="github.common.border"
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
					<Button
						aspectSize="s"
						maxWidth="100%"
						onClick={async () => {
							await storageHandlers.removeStorageItem('github_token');
							messageHandlers.sendBackgroundMessage({
								type: 'token_updated'
							});
						}}
						variant="secondary"
						width={300}
					>
						Change token
					</Button>
				</Flex>
				<Divider px={3} />
				<Flex flexDirection="column" rowGap={2} p={3}>
					<Title aspectSize="uppercase" color="neutral.400">
						Options
					</Title>
					<CheckBox
						description="Joins empty folders in a unique folder reducing the directory tree size."
						isSelected={!!storageData.hide_unimplemented_pages}
						label="Hide sidebar if page is not implemented"
						onChange={() =>
							storageHandlers.setStorageItem('hide_unimplemented_pages', !storageData.hide_unimplemented_pages)
						}
					/>
					<CheckBox
						description="Joins empty folders in a unique folder reducing the directory tree size."
						isSelected={!!storageData.group_folders}
						label="Group empty folders"
						onChange={() => storageHandlers.setStorageItem('group_folders', !storageData.group_folders)}
					/>
					<CheckBox
						description="Speed up big repositories. Enabling this option prevents loading the whole tree at first, then searching
						will only find loaded folders and files."
						isSelected={!!storageData.lazy_load_tree}
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
							addToast({ aspectSize: 's', key: 'settings-saved', message: 'Settings saved', status: 'success' });
						}}
						variant="primary"
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
