import React, { SyntheticEvent } from 'react';

import icos from 'data/icos';
import { firstLetterToUpper } from 'core/string';

export type ButtonColor = 'default' | 'yellow' | 'red' | 'green' | 'blue' | 'grey';
export type ButtonSize = 'default' | 'small' | 'large';

interface IButtonContainerProps {
	readonly type?: 'button' | 'submit' | 'reset';
	readonly ico?: string;
	readonly size?: ButtonSize;
	readonly color?: ButtonColor;
	readonly text: string;
	readonly onClick?: (e: SyntheticEvent<any>) => void;
}

const Button: React.SFC<IButtonContainerProps> = props => {
	const { type, ico, size, color, text, onClick } = props;
	const typeName = ('submit' === type ? type : 'button');
	const icoName = (ico ? icos[ico] : icos.default) || '';
	const sizeCls = `Button--size${firstLetterToUpper(size || 'default')}`;
	const colorCls = `Button--color${firstLetterToUpper(color || 'default')}`;

	return (
		<button className={`Button ${sizeCls} ${colorCls}`} type={typeName} onClick={onClick}>
			{icoName ? <span className="Button-ico">{icoName}</span> : ''}
			{text}
		</button>
	);
};

export default Button;
