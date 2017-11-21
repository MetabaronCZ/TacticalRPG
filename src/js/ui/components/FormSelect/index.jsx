import React from 'react';

const FormSelect = ({ id, name, value, disabled, onChange, children }) => (
	<select id={id} name={name} className="FormSelect" value={value} onChange={onChange} disabled={disabled}>
		{children}
	</select>
);

export default FormSelect;
