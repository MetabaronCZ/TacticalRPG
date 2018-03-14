import React, { SyntheticEvent } from 'react';

interface IFormSelect {
	id?: string;
	name?: string;
	value?: string;
	disabled?: boolean;
	onChange?: (e: SyntheticEvent<any>) => void;
}

const FormSelect: React.SFC<IFormSelect> = ({ id, name, value = '', disabled, onChange, children }) => (
	<select id={id} name={name} className="FormSelect" value={value} onChange={onChange} disabled={disabled}>
		{children}
	</select>
);

export default FormSelect;
