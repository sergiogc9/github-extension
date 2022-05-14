import { DefaultTheme } from 'styled-components';
import reactUITheme, { ThemePalette } from '@sergiogc9/react-ui-theme';

import Storage from 'lib/Storage';
import { GithubColors } from 'types/theme';

import { GithubThemeMode } from './types';

// Palettes obtained from:
// https://hihayk.github.io/scale/#4/5/50/85/-50/20/0/14/0969da/9/105/218/white

const githubLightPrimaryColors: ThemePalette['primary'] = {
	50: '#DAF3FA',
	100: '#B0E1F3',
	200: '#87CAED',
	300: '#5DAEE7',
	400: '#338EE0',
	500: '#0969da',
	600: '#0534C2',
	700: '#0108A9',
	800: '#17008F',
	900: '#2A0074'
};
const githubDarkPrimaryColors: ThemePalette['primary'] = {
	50: '#E5F8FE',
	100: '#C8EDFC',
	200: '#ABDEFA',
	300: '#8ECBF8',
	400: '#70B5F7',
	500: '#539bf5',
	600: '#4669D9',
	700: '#3A3EBC',
	800: '#432F9E',
	900: '#482480'
};
const purpleColors: ThemePalette['primary'] = {
	50: '#E5E5FA',
	100: '#CBC7F5',
	200: '#B4A9EF',
	300: '#A08CEA',
	400: '#8F6EE4',
	500: '#8250DF',
	600: '#8C44C5',
	700: '#9038AB',
	800: '#8E2D90',
	900: '#752366'
};

const getLightGithubColors = (githubMode: GithubThemeMode): GithubColors => {
	if (githubMode === 'light_high_contrast')
		return {
			branch: { bg: '#DFF7FF', text: '#0349b4' },
			common: { bgHover: '#E7ECF0', border: '#88929D' },
			popup: { header: '#24282F' },
			sidebar: { header: '#FFFFFF', toolbar: '#FFFFFF' },
			tab: { bg: '#FFFFFF', bgHover: '#E7ECF0', bottomLine: '#FE8C73' }
		};

	// Light
	return {
		branch: { bg: '#ddf4ff', text: '#0969da' },
		common: { bgHover: '#f6f8fa', border: 'hsla(210,18%,87%,1)' },
		popup: { header: '#24282F' },
		sidebar: { header: '#F6F8FA', toolbar: '#F6F8FA' },
		tab: { bg: '#F6F8FA', bgHover: '#EAEDF1', bottomLine: '#FE8C73' }
	};
};

const getDarkCommonColors = (githubMode: GithubThemeMode): Partial<ThemePalette['common']> => {
	if (githubMode === 'dark_dimmed') return { background: '#22272E', text: '#adbac7' };

	if (githubMode === 'dark_high_contrast')
		return {
			background: '#0A0C10',
			text: '#f0f3f6'
		};

	// Dark
	return {
		background: '#0D1118',
		text: '#c9d1d9'
	};
};

const getDarkGithubColors = (githubMode: GithubThemeMode): GithubColors => {
	if (githubMode === 'dark_dimmed')
		return {
			branch: { bg: 'rgba(65,132,228,0.15)', text: '#539bf5' },
			common: { bgHover: '#2d333b', border: '#373e47' },
			popup: { header: '#2D333B' },
			sidebar: { header: '#2D333B', toolbar: '#2D333B' },
			tab: { bg: '#22272E', bgHover: 'rgba(144, 157, 171, 0.12)', bottomLine: '#EC775C' }
		};

	if (githubMode === 'dark_high_contrast')
		return {
			branch: { bg: '#132234', text: '#71b7ff' },
			common: { bgHover: '#272b33', border: '#7B828E' },
			popup: { header: '#2D333B' },
			sidebar: { header: '#272b33', toolbar: '#272b33' },
			tab: { bg: '#0A0C10', bgHover: '#272B33', bottomLine: '#FF967D' }
		};

	// Dark
	return {
		branch: { bg: '#13233A', text: '#58a6ff' },
		common: { bgHover: '#161b22', border: '#21262d' },
		popup: { header: '#2D333B' },
		sidebar: { header: '#161B22', toolbar: '#161B22' },
		tab: { bg: '#0D1118', bgHover: 'rgba(177, 186, 196, 0.12)', bottomLine: '#F88166' }
	};
};

const generateTheme = async (githubMode?: GithubThemeMode) => {
	const finalMode: GithubThemeMode = githubMode ?? (await Storage.get('github_theme_mode')) ?? 'light';

	const theme: DefaultTheme = {
		...reactUITheme,
		mode: finalMode.startsWith('light') ? 'light' : 'dark',
		colors: {
			...reactUITheme.colors,
			github: {
				branch: { bg: '', text: '' },
				common: { bgHover: '', border: '' },
				popup: { header: '' },
				sidebar: { header: '', toolbar: '' },
				tab: { bg: '', bgHover: '', bottomLine: '' }
			},
			purple: purpleColors,
			modes: {
				light: {
					...reactUITheme.colors.modes.light,
					primary: githubLightPrimaryColors,
					github: getLightGithubColors(finalMode),
					purple: purpleColors
				},
				dark: {
					...reactUITheme.colors.modes.dark,
					primary: githubDarkPrimaryColors,
					common: {
						...reactUITheme.colors.modes.dark.common,
						...getDarkCommonColors(finalMode)
					},
					github: getDarkGithubColors(finalMode),
					purple: purpleColors
				}
			}
		},
		components: {
			...reactUITheme.components,
			button: {
				...reactUITheme.components.button,
				colors: {
					...reactUITheme.components.button.colors,
					modes: {
						light: {
							...reactUITheme.components.button.colors.modes.light,
							github: {
								background: { default: 'purple.500', hover: 'purple.400', active: 'purple.600' },
								focusShadow: 'purple.300'
							}
						},
						dark: {
							...reactUITheme.components.button.colors.modes.dark,
							github: {
								background: { default: 'purple.500', hover: 'purple.400', active: 'purple.600' },
								focusShadow: 'purple.300'
							}
						}
					}
				}
			}
		}
	};

	return theme;
};

export { generateTheme };
