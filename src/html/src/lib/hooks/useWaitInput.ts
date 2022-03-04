import React from 'react';

import { useTimeout } from './useTimeout';

// Hook to handle inputs changes waiting some time to get a final value (useful to not fetch at each input change)
export const useWaitInput = (ms: number) => {
	const [value, setValue] = React.useState('');
	const [finalValue, setFinalValue] = React.useState('');

	const onChangeValue = React.useCallback(ev => {
		setValue(ev.target.value);
	}, []);

	const { run, clear } = useTimeout();

	React.useEffect(() => {
		clear();
		run(() => setFinalValue(value), ms);
		return clear;
	}, [value]); // eslint-disable-line react-hooks/exhaustive-deps

	return { value, finalValue, setValue, onChangeValue };
};
