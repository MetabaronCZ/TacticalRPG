import React from 'react';
import icos from 'utils/icos';
import sizes from 'ui/components/Button/sizes';
import colors from 'ui/components/Button/colors';

const ButtonContainer = ({ type, ico, size, color, text, onClick }) => {
	type = ('submit' === type ? type : 'button');
	ico = icos[ico] || icos.default;
	size = sizes[size] || sizes.default;
	color = colors[color] || colors.default;

	return (
		<button className={`Button Button--size${size} Button--color${color}`} type={type} onClick={onClick}>
			{ico ? <span className="Button-ico">{ico}</span> : ''}
			{text}
		</button>
	);
};

export default ButtonContainer;
