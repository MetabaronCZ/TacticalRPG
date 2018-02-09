import React, { SyntheticEvent } from 'react';

interface IInputProps {
	id: string;
	type: string;
	value: string;
	placeholder: string;
	name: string;
	maxLength: number;
	disabled?: boolean;
	isInvalid: boolean;
	onChange: (e: SyntheticEvent<any>) => void;
}

const Input: React.SFC<IInputProps> = ({ id, type, value, placeholder, name, maxLength, disabled, isInvalid, onChange }) => (
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
