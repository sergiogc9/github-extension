import { ExtensionStatus } from 'types/Extension';

import { PopupRoute } from '../types';

type ExtensionPopupHeaderProps = {
	onChangeRoute: (route: PopupRoute) => void;
	status: ExtensionStatus;
};

export type { ExtensionPopupHeaderProps };
