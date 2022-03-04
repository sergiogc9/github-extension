import React from 'react';
import { useToasts } from '@sergiogc9/react-ui';
import {
	Alert,
	ScrollArea,
	Widget,
	WidgetContent,
	Divider,
	Button,
	TextField,
	FormGroupContainer,
	FormGroup,
	Checkbox
} from '@duik/it';

import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { StorageContext, StorageHandlerContext } from 'components/Extension/Context/StorageContext';
import { FontAwesomeIcon } from 'components/common/Icon/Icon';

import './ExtensionSettings.scss';

const ExtensionSettings: React.FC = () => {
	const storageData = React.useContext(StorageContext)!;
	const storageHandlers = React.useContext(StorageHandlerContext)!;
	const messageHandlers = React.useContext(MessageHandlersContext)!;

	const { addToast } = useToasts();

	return (
		<div id="githubExtensionAppSettings">
			<ScrollArea>
				<Widget>
					<WidgetContent className="header">
						<h3>Settings</h3>
					</WidgetContent>
					<Divider />
					<WidgetContent>
						<FormGroupContainer>
							<label>github token</label>
							<FormGroup>
								<TextField
									id="githubSettingsTokenInput"
									defaultValue={storageData.token}
									placeholder="Enter github token"
									onBlur={ev => {
										storageHandlers.setStorageItem('github_token', ev.target.value);
										messageHandlers.sendBackgroundMessage({
											type: 'token_updated'
										});
									}}
								/>
								<Alert id="githubSettingsTokenAlert" leftEl={<FontAwesomeIcon name="info-circle" type="duo" />} primary>
									Token is saved only in browser local storage.
								</Alert>
							</FormGroup>
						</FormGroupContainer>
					</WidgetContent>
					<Divider />
					<WidgetContent>
						<FormGroupContainer>
							<label>Options</label>
							<FormGroupContainer horizontal>
								<FormGroup>
									<Checkbox
										label="Hide sidebar if page is not implemented"
										description="There are only few github pages implemented in this extension. Enable this option to hide the sidebar in these pages."
										checked={storageData.hide_unimplemented_pages}
										onChange={() =>
											storageHandlers.setStorageItem('hide_unimplemented_pages', !storageData.hide_unimplemented_pages)
										}
									/>
								</FormGroup>
							</FormGroupContainer>
							<FormGroupContainer horizontal>
								<FormGroup>
									<Checkbox
										label="Group empty folders"
										description="Joins empty folders in a unique folder reducing the directory tree size."
										checked={storageData.group_folders}
										onChange={() => storageHandlers.setStorageItem('group_folders', !storageData.group_folders)}
									/>
								</FormGroup>
							</FormGroupContainer>
							<FormGroupContainer horizontal>
								<FormGroup>
									<Checkbox
										label="Lazy load code trees"
										description="Speed up big repositories. Enabling this option prevents loading the whole tree at first, then searching will only find loaded folders and files."
										checked={storageData.lazy_load_tree}
										onChange={() => storageHandlers.setStorageItem('lazy_load_tree', !storageData.lazy_load_tree)}
									/>
								</FormGroup>
							</FormGroupContainer>
						</FormGroupContainer>
					</WidgetContent>
					<WidgetContent className="save-btn">
						<Button
							primary
							onClick={() => {
								addToast({ key: 'settings-saved', message: 'Settings saved', status: 'success' });
							}}
						>
							Apply settings
						</Button>
					</WidgetContent>
				</Widget>
			</ScrollArea>
		</div>
	);
};

export default React.memo(ExtensionSettings);
