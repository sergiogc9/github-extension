import 'styled-components';

import { ColorPalette, DefaultThemeAttributes, Theme, ThemeColors, ThemePalette } from '@sergiogc9/react-ui-theme';

type GithubColors = {
	branch: Record<'bg' | 'text', string>;
	common: Record<'border' | 'bgHover', string>;
	popup: Record<'header', string>;
	sidebar: Record<'header' | 'toolbar', string>;
};

type FinalThemePalette = ThemePalette & {
	github: GithubColors;
	purple: ColorPalette;
};

export interface ThemeAttributes extends Omit<DefaultThemeAttributes, 'ButtonVariant'> {
	ButtonVariant: DefaultThemeAttributes['ButtonVariant'] | 'github';
}

declare module 'styled-components' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme<ThemeAttributes> {
		colors: ThemeColors<FinalThemePalette>;
	}
}
