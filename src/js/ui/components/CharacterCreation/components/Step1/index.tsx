import React from 'react';

import FormField from 'ui/components/FormField';
import FormInput from 'ui/components/FormInput';
import FormRadio from 'ui/components/FormRadio';

import icos from 'data/icos';

import { Sexes } from 'models/sex';
import { ICharacterData } from 'models/character';
import { maxNameLength } from 'models/character/utils';

interface IStep1Props {
	fields: ICharacterData;
	errors: {
		[field: string]: string;
	};
	onChange: () => void;
}

const Step1: React.SFC<IStep1Props> = ({ fields, errors, onChange }) => (
	<div>
		<FormField fieldId="f-name" label="Name" error={errors.name}>
			<FormInput
				id="f-name"
				type="text"
				value={fields.name}
				placeholder="Type character name ..."
				name="name"
				maxLength={maxNameLength}
				isInvalid={!!errors.name}
				onChange={onChange}
			/>
		</FormField>

		<FormField fieldId="f-sex" label="Sex" error={errors.sex}>
			{Sexes.map((id, sex, i) => {
				return (
					<FormRadio id={`f-sex-${id}`} label={`${icos[id.toLocaleLowerCase()]} ${sex ? sex.title : ''}`} name="sex" value={id} isChecked={id === fields.sex} key={i} onChange={onChange} />
				);
			})}
		</FormField>
	</div>
);

export default Step1;
