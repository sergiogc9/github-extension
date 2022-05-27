import React from 'react';
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Flex, Icon } from '@sergiogc9/react-ui';

import { StyledActionMenu, StyledActionMenuItem, StyledFontAwesomeIcon } from './styled';
import { ExtensionPopupPullRequestsMenuProps } from './types';

const ExtensionPopupPullRequestsMenu: React.FC<ExtensionPopupPullRequestsMenuProps> = React.memo(
	({ isStarred, isHidden, onHideClick, onStarClick }) => {
		const [isOpen, setIsOpen] = React.useState(false);
		const triggerRef = React.useRef(null);

		return (
			<>
				<Flex flexShrink={0} onClick={() => setIsOpen(!isOpen)} ml={1} mr={2} ref={triggerRef}>
					<StyledFontAwesomeIcon aspectSize="s" icon={solid('ellipsis-h')} />
				</Flex>
				<StyledActionMenu
					isVisible={isOpen}
					placement="right-start"
					reference={triggerRef}
					tippyProps={{ onClickOutside: () => setIsOpen(false) }}
					trigger="click"
				>
					<StyledActionMenuItem
						onClick={() => {
							setIsOpen(false);
							onStarClick();
						}}
					>
						<Icon.FontAwesome aspectSize="xs" icon={isStarred ? regular('star') : solid('star')} mr={1} />
						{isStarred ? 'Unstar' : 'Star'}
					</StyledActionMenuItem>
					<StyledActionMenuItem onClick={onHideClick}>
						<Icon.FontAwesome aspectSize="xs" icon={isHidden ? solid('eye') : solid('eye-slash')} mr={1} />
						{isHidden ? 'Show again' : 'Hide'}
					</StyledActionMenuItem>
				</StyledActionMenu>
			</>
		);
	}
);

export { ExtensionPopupPullRequestsMenu };
