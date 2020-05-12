import React from 'react';
import { Alert, ScrollArea, Widget, WidgetContent, Divider, Button, TextField, FormGroupContainer, FormGroup, Checkbox } from '@duik/it';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { StorageContext, StorageHandlerContext } from '../Context/StorageContext';

import './ExtensionSettings.scss';

const ExtensionSettings: React.FC = props => {
	const storageData = React.useContext(StorageContext)!;
	const storageHandlers = React.useContext(StorageHandlerContext)!;

	return (
		<div id="githubExtensionAppSettings">
			<ScrollArea>
				<Widget>
					<WidgetContent className='header'>
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
									placeholder='Enter github token'
									onBlur={ev => storageHandlers.setStorageItem('github_token', ev.target.value)}
								/>
								<Alert id='githubSettingsTokenAlert' leftEl={<FontAwesomeIcon icon={['fad', 'info-circle']} />} primary>Token is saved only in browser local storage.</Alert>
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
										label="Group empty folders"
										description='Joins empty folders in a unique folder reducing the directory tree size.'
										checked={storageData.group_folders}
										onChange={() => storageHandlers.setStorageItem('group_folders', !storageData.group_folders)} />
								</FormGroup>
							</FormGroupContainer>
							<FormGroupContainer horizontal>
								<FormGroup>
									<Checkbox
										label="Lazy load code trees"
										description='Speed up big repositories. Enabling this option prevents loading the whole tree at first, then searching will only find loaded folders and files.'
										checked={storageData.lazy_load_tree}
										onChange={() => storageHandlers.setStorageItem('lazy_load_tree', !storageData.lazy_load_tree)} />
								</FormGroup>
							</FormGroupContainer>
						</FormGroupContainer>
					</WidgetContent>
					<WidgetContent className='save-btn'>
						<Button primary>Apply settings</Button>
					</WidgetContent>
				</Widget>
			</ScrollArea>
		</div>
	);
};

export default React.memo(ExtensionSettings);
