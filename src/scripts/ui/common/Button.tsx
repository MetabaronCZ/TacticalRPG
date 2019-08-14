import React, { SyntheticEvent } from 'react';

import { IcoID, Icos } from 'data/icos';
import { firstLetterToUpper } from 'core/string';

export type ButtonColor = 'default' | 'yellow' | 'red' | 'green' | 'blue' | 'grey';
export type ButtonSize = 'default' | 'small' | 'large';
export type ButtonType = 'button' | 'submit' | 'reset';

interface IButtonContainerProps {
	readonly type?: ButtonType;
	readonly ico?: IcoID;
	readonly size?: ButtonSize;
	readonly color?: ButtonColor;
	readonly text: string;
	readonly onClick?: (e: SyntheticEvent<HTMLButtonElement>) => void;
}

const Button: React.SFC<IButtonContainerProps> = props => {
	const { type = 'button', ico = 'default', size, color, text, onClick } = props;
	const sizeCls = `Button--size${firstLetterToUpper(size || 'default')}`;
	const colorCls = `Button--color${firstLetterToUpper(color || 'default')}`;

	return (
		<button className={`Button ${sizeCls} ${colorCls}`} type={type} onClick={onClick}>
			{Icos[ico] ? <span className="Button-ico">{Icos[ico]}</span> : ''}
			{text}
		</button>
	);
};

export default Button;
