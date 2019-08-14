import React, { SyntheticEvent } from 'react';

type InputTypes = 'text';

interface IInputProps {
	readonly id: string;
	readonly name: string;
	readonly value: string;
	readonly type?: InputTypes;
	readonly maxLength?: number;
	readonly disabled?: boolean;
	readonly isInvalid?: boolean;
	readonly placeholder?: string;
	readonly onChange: (e: SyntheticEvent<HTMLInputElement>) => void;
}

const FormInput: React.SFC<IInputProps> = props => {
	const { id, type = 'text', value, placeholder, name, maxLength, disabled, isInvalid, onChange } = props;
	const cls = `FormInput is-${isInvalid ? 'invalid' : 'valid'}`;

	return (
		<input
			id={id}
			className={cls}
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
};

export default FormInput;
