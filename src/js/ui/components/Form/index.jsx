import React from 'react';

const Form = ({ children, onSubmit }) => (
	<form className="Form" onSubmit={onSubmit}>
		{children}
	</form>
);

export default Form;
