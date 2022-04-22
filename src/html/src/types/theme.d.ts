import 'styled-components';

import { DefaultThemeAttributes, Theme, ThemeColors, ThemePalette } from '@sergiogc9/react-ui-theme';

// TODO! get from react-ui-theme
interface ColorPalette {
	readonly 0?: string;
	readonly 50: string;
	readonly 100: string;
	readonly 200: string;
	readonly 300: string;
	readonly 400: string;
	readonly 500: string;
	readonly 600: string;
	readonly 700: string;
	readonly 800: string;
	readonly 900: string;
}

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
