import React from 'react';
import { useToasts } from '@sergiogc9/react-ui';

export const useOnGithubApiError = () => {
	const { addToast } = useToasts();

	const onGithubApiError = React.useCallback(
		(error: Error) => {
			addToast({ aspectSize: 's', key: error.message, message: error.message, status: 'error' });
		},
		[addToast]
	);

	return { onGithubApiError };
};
