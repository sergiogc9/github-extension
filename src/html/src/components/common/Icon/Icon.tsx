import React from 'react';
import SVG from 'react-inlinesvg';

import './Icon.scss';

type NucleoIconName = 'a-chat';
type NucleoIconType = 'solid' | 'duo' | 'color' | 'animated' | 'interactive';
type NucleoIconProps = { family: 'nucleo', name: NucleoIconName, type: NucleoIconType };

type FontAwesomeIconName = 'github' | 'chevron-double-right' | 'file-alt' | 'angle-down' | 'angle-right' | 'info-circle' | 'search' | 'times' | 'cog' | 'caret-up' | 'square' | 'code-commit' | 'copy';
type FontAwesomeIconType = 'light' | 'regular' | 'solid' | 'duo' | 'brand';
type FontAwesomeIconProps = { family: 'font-awesome', name: FontAwesomeIconName, type: FontAwesomeIconType };

type SymbolicIconName = 'pull-request' | 'chat-conversation-alt';
type SymbolicIconType = 'light' | 'solid' | 'duo' | 'color';
type SymbolicIconProps = { family: 'symbolicon', name: SymbolicIconName, type: SymbolicIconType };

type MaterialUIName = 'library-books' | 'check';
type MaterialUIIconProps = { family: 'material-ui', name: MaterialUIName, type?: 'default' }

type IconProps =
	NucleoIconProps |
	FontAwesomeIconProps |
	SymbolicIconProps |
	MaterialUIIconProps;

type CommonProps = {
	className?: string,
	onClick?: () => void,
	color?: string,
	secondaryColor?: string,
	spin?: 'slow' | 'normal' | 'fast', // if other is needed, use directly the spin() scss animation
	pulse?: number, // Up to ten
	rotate?: number // In degrees
	flip?: 'vertical' | 'horizontal' | 'both'
};

type ComponentProps = CommonProps & IconProps;

const Icon: React.FC<ComponentProps> = props => {
	const { family, name, type, className, color, secondaryColor, spin, pulse, rotate, flip } = props;
	const { onClick } = props;

	const svgRef = React.useRef<HTMLElement>(null);

	const iconFile = React.useMemo(() => {
		if (family === 'nucleo') return `nc-${name}-${type}`;
		if (family === 'font-awesome') {
			if (type === 'brand') return `fa-${name}`;
			return `fa-${name}-${type}`;
		}
		if (family === 'symbolicon') return `symb-${name}-${type}`;
		if (family === 'material-ui') return `mui-${name}`;
		return 'unknown';
	}, [family, name, type]);

	const iconFamilyClass = React.useMemo(() => {
		if (family === 'nucleo') return 'nc-icon';
		if (family === 'font-awesome') return 'fa-icon';
		if (family === 'symbolicon') return 'symb-icon';
		if (family === 'material-ui') return `mui-icon`;
	}, [family]);

	const iconClasses = React.useMemo(() => {
		let classes = [iconFamilyClass, iconFile];
		if (type === 'color') classes.push('keep-color');
		if (className) classes.push(className);
		if (spin) {
			if (spin === 'slow') classes.push('icon-spin-slow');
			if (spin === 'normal') classes.push('icon-spin-normal');
			if (spin === 'fast') classes.push('icon-spin-fast');
		}
		if (pulse) classes.push(`icon-pulse-${pulse}`);
		if (rotate) classes.push('icon-rotate');
		if (flip) classes.push(`icon-flip-${flip}`);

		return classes.join(' ');
	}, [type, className, iconFamilyClass, iconFile, spin, pulse, rotate, flip]);

	const onLoadSvg = React.useCallback(() => {
		if (svgRef.current) {
			if (color) svgRef.current.style.setProperty('color', color);
			else svgRef.current.style.removeProperty('color');
			if (secondaryColor) svgRef.current.style.setProperty('--icon-secondary-color', secondaryColor);
			else svgRef.current.style.removeProperty('--icon-secondary-color');
			if (rotate) svgRef.current.style.setProperty('--icon-rotation', `${rotate}deg`);
			else svgRef.current.style.removeProperty('--icon-rotation');
		}
	}, [svgRef, color, secondaryColor, rotate]);

	return <SVG className={`react-icon ${iconClasses}`} src={`icons/${iconFile}.svg`} innerRef={svgRef} onLoad={onLoadSvg} onClick={onClick} />;
};

export const NucleoIcon: React.FC<CommonProps & Omit<NucleoIconProps, 'family'>> = React.memo(props => <Icon family='nucleo' {...props} />);
export const FontAwesomeIcon: React.FC<CommonProps & Omit<FontAwesomeIconProps, 'family'>> = React.memo(props => <Icon family='font-awesome' {...props} />);
export const SymbolicIcon: React.FC<CommonProps & Omit<SymbolicIconProps, 'family'>> = React.memo(props => <Icon family='symbolicon' {...props} />);
export const MaterialUIIcon: React.FC<CommonProps & Omit<MaterialUIIconProps, 'family'>> = React.memo(props => <Icon family='material-ui' {...props} />);

export default React.memo(Icon);
