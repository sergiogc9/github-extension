import 'styled-components';

import { Theme, ThemeColors, ThemePalette } from '@sergiogc9/react-ui-theme';

type GithubColors = {
	branch: Record<'bg' | 'text', string>;
	common: Record<'border' | 'bgHover', string>;
	popup: Record<'header', string>;
	sidebar: Record<'header' | 'toolbar', string>;
};
type FinalThemePalette = ThemePalette & {
	github: GithubColors;
};

declare module 'styled-components' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {
		colors: ThemeColors<FinalThemePalette>;
	}
}
