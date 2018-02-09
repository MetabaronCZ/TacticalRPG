import React, { SyntheticEvent } from 'react';

interface IFormProps {
	onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
}

const Form: React.SFC<IFormProps> = ({ children, onSubmit }) => (
	<form className="Form" onSubmit={onSubmit}>
		{children}
	</form>
);

export default Form;
