import React from 'react';

const FormSelectItem = ({ value, children }) => (
	<option className="FormSelect-item" value={value}>
		{children}
	</option>
);

export default FormSelectItem;
