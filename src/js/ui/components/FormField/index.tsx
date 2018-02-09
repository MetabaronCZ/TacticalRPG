import React from 'react';

interface IFormFieldProps {
	label: string;
	info?: string;
	fieldId: string;
	error?: string;
}

const FormField: React.SFC<IFormFieldProps> = ({ label, info, fieldId, children, error }) => (
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
