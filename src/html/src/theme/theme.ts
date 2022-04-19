import { DefaultTheme } from 'styled-components';
import reactUITheme, { ThemePalette } from '@sergiogc9/react-ui-theme';

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

const theme: DefaultTheme = {
	...reactUITheme,
	// mode: 'dark',
	colors: {
		...reactUITheme.colors,
		github: { common: { bgHover: '', border: '' }, popup: { header: '' }, sidebar: { header: '', toolbar: '' } },
		modes: {
			light: {
				...reactUITheme.colors.modes.light,
				primary: githubLightPrimaryColors,
				github: {
					common: { bgHover: '#f6f8fa', border: 'hsla(210,18%,87%,1)' },
					popup: { header: '#24282F' },
					sidebar: { header: '#F6F8FA', toolbar: '#F6F8FA' }
				}
			},
			dark: {
				...reactUITheme.colors.modes.dark,
				primary: githubDarkPrimaryColors,
				common: {
					...reactUITheme.colors.modes.dark.common,
					background: '#22272E',
					text: '#adbac7'
				},
				github: {
					common: { bgHover: '#2d333b', border: '#373e47' },
					popup: { header: '#2D333B' },
					sidebar: { header: '#2D333B', toolbar: '#2D333B' }
				}
			}
		}
	}
};

export { theme };
