import React, { SyntheticEvent } from 'react';
import icos from 'utils/icos';
import ButtonSize from 'ui/components/Button/sizes';
import ButtonColor from 'ui/components/Button/colors';

interface IButtonContainerProps {
	type?: string;
	ico?: string;
	size?: string;
	color?: string;
	text: string;
	onClick?: (e: SyntheticEvent<any>) => void;
}

const ButtonContainer = ({ type, ico, size, color, text, onClick }: IButtonContainerProps): JSX.Element => {
	const typeName = ('submit' === type ? type : 'button');
	const icoName = (ico ? icos[ico] : icos.default) || '';
	const sizeName = (size ? ButtonSize[size] : ButtonSize.default) || '';
	const colorName = (color ? ButtonColor[color] : ButtonColor.default) || '';

	return (
		<button className={`Button Button--size${sizeName} Button--color${colorName}`} type={typeName} onClick={onClick}>
			{icoName ? <span className="Button-ico">{icoName}</span> : ''}
			{text}
		</button>
	);
};

export default ButtonContainer;
