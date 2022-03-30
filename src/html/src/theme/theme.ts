import { DefaultTheme } from 'styled-components';
import reactUITheme from '@sergiogc9/react-ui-theme';

const theme: DefaultTheme = {
	...reactUITheme,
	mode: 'dark',
	colors: {
		...reactUITheme.colors,
		github: { header: '' },
		modes: {
			light: {
				...reactUITheme.colors.modes.light,
				github: { header: '#24282F' }
			},
			dark: {
				...reactUITheme.colors.modes.dark,
				github: { header: '#2D333B' }
			}
		}
	}
};

export { theme };
