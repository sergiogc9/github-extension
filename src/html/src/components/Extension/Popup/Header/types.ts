import { ExtensionStatus } from 'types/Extension';

import { PopupRoute } from '../types';

type ExtensionPopupHeaderProps = {
	onChangeRoute: (route: PopupRoute) => void;
	route: PopupRoute;
	status: ExtensionStatus;
};

export type { ExtensionPopupHeaderProps };
