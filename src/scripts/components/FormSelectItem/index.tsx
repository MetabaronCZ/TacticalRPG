import React from 'react';

interface IFormSelectItemProps {
	readonly value?: string;
}

const FormSelectItem: React.SFC<IFormSelectItemProps> = ({ value, children }) => (
	<option className="FormSelect-item" value={value}>
		{children}
	</option>
);

export default FormSelectItem;
