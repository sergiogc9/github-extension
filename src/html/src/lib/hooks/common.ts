import React from 'react';

// Hook to handle timeouts. Useful inside useEffect hook.
export const useTimeout = () => {
	const timeoutId = React.useRef<number>();

	const clear = React.useCallback(() => {
		if (timeoutId.current) clearTimeout(timeoutId.current);
	}, []);

	const run = React.useCallback((callback: Function, delay: number) => {
		clear();
		timeoutId.current = setTimeout(callback, delay);
	}, [clear]);

	return { run, clear };
};
