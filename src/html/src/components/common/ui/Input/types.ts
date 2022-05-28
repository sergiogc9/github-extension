import React from 'react';
import { BoxProps, FlexProps } from '@sergiogc9/react-ui';

type Props = {
	readonly inputProps: React.InputHTMLAttributes<HTMLInputElement>;
	readonly leftContent?: React.ReactNode;
	readonly rightContent?: React.ReactNode;
};

export type GithubInputProps = Props & FlexProps;

export type StyledGithubInputProps = BoxProps<React.InputHTMLAttributes<HTMLInputElement>>;
