import React, { SyntheticEvent } from 'react';

interface IInputProps {
	readonly id: string;
	readonly type: string;
	readonly value: string;
	readonly placeholder?: string;
	readonly name: string;
	readonly maxLength: number;
	readonly disabled?: boolean;
	readonly isInvalid: boolean;
	readonly onChange: (e: SyntheticEvent<any>) => void;
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
