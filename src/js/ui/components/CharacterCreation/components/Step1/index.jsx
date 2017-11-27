import React from 'react';

import FormField from 'ui/components/FormField';
import FormInput from 'ui/components/FormInput';
import FormRadio from 'ui/components/FormRadio';

import { maxNameLength } from 'utils/character';
import icos from 'utils/icos';

import Sex from 'data/sex';

const Step1 = ({ fields, errors, onChange }) => (
	<div>
		<FormField fieldId="f-name" label="Name" error={errors.name}>
			<FormInput
				id="f-name"
				type="text"
				value={fields.name}
				placeholder="Type character name ..."
				name="name"
				maxLength={maxNameLength}
				isInvalid={errors.name}
				onChange={onChange}
			/>
		</FormField>

		<FormField fieldId="f-sex" label="Sex" error={errors.sex}>
			{Array.from(Sex.keys()).map((s, i) => (
				<FormRadio id={`f-sex-${s}`} label={`${icos[s.toLocaleLowerCase()]} ${Sex.get(s).title}`} name="sex" value={s} isChecked={s === fields.sex} key={i} onChange={onChange} />
			))}
		</FormField>
	</div>
);

export default Step1;
