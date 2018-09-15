import React, { SyntheticEvent } from 'react';
import icos from 'data/icos';

export enum ButtonColor {
	DEFAULT = 'Default',
	YELLOW = 'Yellow',
	RED = 'Red',
	GREEN = 'Green',
	BLUE = 'Blue',
	GREY = 'Grey'
}

export enum ButtonSize {
	DEFAULT = 'Default',
	SMALL = 'Small',
	LARGE = 'Large'
}

interface IButtonContainerProps {
	readonly type?: string;
	readonly ico?: string;
	readonly size?: string;
	readonly color?: string;
	readonly text: string;
	readonly onClick?: (e: SyntheticEvent<any>) => void;
}

const Button: React.SFC<IButtonContainerProps> = props => {
	const { type, ico, size, color, text, onClick } = props;
	const typeName = ('submit' === type ? type : 'button');
	const icoName = (ico ? icos[ico] : icos.default) || '';
	const sizeName = size || ButtonSize.DEFAULT;
	const colorName = color || ButtonColor.DEFAULT;

	return (
		<button className={`Button Button--size${sizeName} Button--color${colorName}`} type={typeName} onClick={onClick}>
			{icoName ? <span className="Button-ico">{icoName}</span> : ''}
			{text}
		</button>
	);
};

export default Button;
