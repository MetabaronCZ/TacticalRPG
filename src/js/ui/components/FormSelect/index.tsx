import React, { SyntheticEvent } from 'react';
import { IFormSelectItemProps } from 'ui/components/FormSelectItem';
import { ReactNode } from 'react-redux';

interface IFormSelect {
	id?: string;
	name?: string;
	value?: string;
	disabled?: boolean;
	onChange?: (e: SyntheticEvent<any>) => void;
	children: ReactNode;
}

const FormSelect = ({ id, name, value, disabled, onChange, children }: IFormSelect): JSX.Element => (
	<select id={id} name={name} className="FormSelect" value={value} onChange={onChange} disabled={disabled}>
		{children}
	</select>
);

export default FormSelect;
