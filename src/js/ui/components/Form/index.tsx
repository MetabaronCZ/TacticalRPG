import React, { ReactNode, SyntheticEvent } from 'react';

interface IFormProps {
	onSubmit: (e: SyntheticEvent<any>) => void;
	children: ReactNode;
}

const Form = ({ children, onSubmit }: IFormProps): JSX.Element => (
	<form className="Form" onSubmit={onSubmit}>
		{children}
	</form>
);

export default Form;
