import React from 'react';

const FormRadio = ({ id, label, name, value, isChecked, onChange }) => (
	<label className="FormRadio" htmlFor={id}>
		<input id={id} className="FormRadio-input" type="radio" name={name} value={value} defaultChecked={isChecked} onChange={onChange} />
		{label}
	</label>
);

export default FormRadio;
