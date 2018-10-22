import React from 'react';

interface IFormSelectItemProps {
	readonly text: string;
	readonly value?: string;
}

const FormSelectItem: React.SFC<IFormSelectItemProps> = ({ text, value }) => (
	<option className="FormSelect-item" value={value}>
		{text}
	</option>
);

export default FormSelectItem;
