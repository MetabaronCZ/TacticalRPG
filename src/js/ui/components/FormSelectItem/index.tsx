import React from 'react';

export interface IFormSelectItemProps {
	value?: string;
	children?: string|JSX.Element|JSX.Element[];
}

const FormSelectItem = ({ value, children }: IFormSelectItemProps): JSX.Element => (
	<option className="FormSelect-item" value={value}>
		{children}
	</option>
);

export default FormSelectItem;
