import { DefaultTheme } from 'styled-components';
import reactUITheme from '@sergiogc9/react-ui-theme';

const theme: DefaultTheme = {
	...reactUITheme,
	mode: 'dark',
	colors: {
		...reactUITheme.colors,

		github: { common: { bgHover: '', border: '' }, popup: { header: '' }, sidebar: { header: '', toolbar: '' } },
		modes: {
			light: {
				...reactUITheme.colors.modes.light,
				github: {
					common: { bgHover: '#f6f8fa', border: 'hsla(210,18%,87%,1)' },
					popup: { header: '#24282F' },
					sidebar: { header: '#F6F8FA', toolbar: '#F6F8FA' }
				}
			},
			dark: {
				...reactUITheme.colors.modes.dark,
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
