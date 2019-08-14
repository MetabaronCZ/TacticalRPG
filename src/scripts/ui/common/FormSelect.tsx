import React, { SyntheticEvent } from 'react';

interface IFormSelect {
	readonly id?: string;
	readonly name?: string;
	readonly value?: string;
	readonly disabled?: boolean;
	readonly onChange?: (e: SyntheticEvent<HTMLSelectElement>) => void;
}

const FormSelect: React.SFC<IFormSelect> = ({ id, name, value = '', disabled, onChange, children }) => (
	<select id={id} name={name} className="FormSelect" value={value} onChange={onChange} disabled={disabled}>
		{children}
	</select>
);

export default FormSelect;
