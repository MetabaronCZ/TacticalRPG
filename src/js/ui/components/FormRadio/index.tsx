import React from 'react';

interface IFormRadioProps {
	id: string;
	label: string;
	name: string;
	value: string;
	isChecked: boolean;
	onChange?: () => void;
}

const FormRadio: React.SFC<IFormRadioProps> = ({ id, label, name, value, isChecked, onChange }) => (
	<label className="FormRadio" htmlFor={id}>
		<input id={id} className="FormRadio-input" type="radio" name={name} value={value} defaultChecked={isChecked} onChange={onChange} />
		{label}
	</label>
);

export default FormRadio;
