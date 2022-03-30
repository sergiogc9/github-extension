import 'styled-components';

import { Theme, ThemeColors, ThemePalette } from '@sergiogc9/react-ui-theme';

type GithubColors = Record<'header', string>;
type FinalThemePalette = ThemePalette & {
	github: GithubColors;
};

declare module 'styled-components' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {
		colors: ThemeColors<FinalThemePalette>;
	}
}
