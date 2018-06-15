import React from 'react';

import icos from 'data/icos';
import { Sexes } from 'modules/sex';
import { CharacterData } from 'modules/character-data';

import FormField from 'components/FormField';
import FormInput from 'components/FormInput';
import FormRadio from 'components/FormRadio';
import { IStepProps } from 'components/CharacterCreation';

const Step1: React.SFC<IStepProps> = ({ fields, errors, onChange }) => (
	<React.Fragment>
		<FormField fieldId="f-name" label="Name" error={errors.name}>
			<FormInput
				id="f-name"
				type="text"
				value={fields.name}
				placeholder="Type character name ..."
				name="name"
				maxLength={CharacterData.maxNameLength}
				isInvalid={!!errors.name}
				onChange={onChange}
			/>
		</FormField>

		<FormField fieldId="f-sex" label="Sex" error={errors.sex}>
			{Sexes.map((id, sex, i) => (
				<FormRadio
					id={`f-sex-${id}`}
					label={`${icos[id.toLocaleLowerCase()]} ${sex ? sex.title : ''}`}
					name="sex"
					value={id}
					isChecked={id === fields.sex}
					key={i}
					onChange={onChange}
				/>
			))}
		</FormField>
	</React.Fragment>
);

export default Step1;
