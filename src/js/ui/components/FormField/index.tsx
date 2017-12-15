import React from 'react';

interface IFormFieldProps {
	label: string;
	info?: string;
	fieldId: string;
	children: string|JSX.Element|JSX.Element[];
	error?: string;
}

const FormField = ({ label, info, fieldId, children, error }: IFormFieldProps): JSX.Element => (
	<fieldset className={`FormField is-${error ? 'invalid' : 'valid'}`}>
		<label className="FormField-label" htmlFor={fieldId}>
			{label}
		</label>

		<span className="FormField-input">
			{children}
		</span>

		<span className="FormField-info">
			<em>{info || '\u00A0'}</em>
		</span>

		{error ? (<span className="FormField-error">{error}</span>) : ''}
	</fieldset>
);

export default FormField;
