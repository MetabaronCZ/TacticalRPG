import React from 'react';

interface IFormFieldProps {
	readonly label: React.ReactNode;
	readonly info?: string;
	readonly fieldId: string;
	readonly error?: string;
}

const FormField: React.SFC<IFormFieldProps> = ({ label: Label, info, fieldId, children, error }) => (
	<fieldset className={`FormField is-${error ? 'invalid' : 'valid'}`}>
		<label className="FormField-label" htmlFor={fieldId}>
			{Label}
		</label>

		<span className="FormField-input">
			{children}
		</span>

		<span className="FormField-info">
			<em>{info || '\u00A0'}</em>
		</span>

		{error && (
			<span className="FormField-error">{error}</span>
		)}
	</fieldset>
);

export default FormField;
