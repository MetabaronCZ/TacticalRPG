import React, { SyntheticEvent } from 'react';
import { firstLetterToUpper } from 'core/string';

export type ButtonColor = 'default' | 'yellow' | 'red' | 'green' | 'blue' | 'grey';
export type ButtonSize = 'default' | 'small' | 'large';
export type ButtonType = 'button' | 'submit' | 'reset';

export type ButtonIco = 'default' |
	'back' | 'next' | 'up' | 'down' |
	'create' | 'destroy' | 'fight' |
	'success';

type IButtonIcos = {
	readonly [id in ButtonIco]: string | null;
};

export const buttonIcos: IButtonIcos = {
	default: null,
	back: '‹',
	next: '›',
	up: '↑',
	down: '↓',
	create: '+',
	destroy: '-',
	fight: '⚔',
	success: '✔'
};

interface IButtonContainerProps {
	readonly type?: ButtonType;
	readonly ico?: ButtonIco;
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
			<span className="Button-ico">{buttonIcos[ico]}</span>
			{text}
		</button>
	);
};

export default Button;
