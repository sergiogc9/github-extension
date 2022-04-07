import { DefaultTheme } from 'styled-components';
import reactUITheme from '@sergiogc9/react-ui-theme';

const theme: DefaultTheme = {
	...reactUITheme,
	mode: 'dark',
	colors: {
		...reactUITheme.colors,
		github: { popup: { header: '' }, sidebar: { header: '', toolbar: '' } },
		modes: {
			light: {
				...reactUITheme.colors.modes.light,
				github: { popup: { header: '#24282F' }, sidebar: { header: '#F6F8FA', toolbar: '#F6F8FA' } }
			},
			dark: {
				...reactUITheme.colors.modes.dark,
				github: { popup: { header: '#2D333B' }, sidebar: { header: '#2D333B', toolbar: '#2D333B' } }
			}
		}
	}
};

export { theme };
