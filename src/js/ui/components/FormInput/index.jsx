import React from 'react';

const Input = ({ id, type, value, placeholder, name, maxLength, disabled, isInvalid, onChange }) => (
	<input
		id={id}
		className={`FormInput is-${isInvalid ? 'invalid' : 'valid'}`}
		type={type}
		placeholder={placeholder}
		autoComplete="off"
		name={name}
		value={value}
		maxLength={maxLength}
		disabled={disabled}
		onChange={onChange}
	/>
);

export default Input;
