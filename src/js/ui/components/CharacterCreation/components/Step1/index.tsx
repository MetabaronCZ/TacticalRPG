import React, { SyntheticEvent } from 'react';

import FormField from 'ui/components/FormField';
import FormInput from 'ui/components/FormInput';
import FormRadio from 'ui/components/FormRadio';

import { maxNameLength } from 'utils/character';
import icos from 'utils/icos';

import Sexes from 'data/sex';
import { SexID } from 'models/sex';
import { ICharacter } from 'models/character';

interface IStep1Props {
	fields: ICharacter;
	errors: {
		[field: string]: string;
	};
	onChange: () => void;
}

const Step1 = ({ fields, errors, onChange }: IStep1Props): JSX.Element => (
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
			{Object.keys(Sexes).map((s: string, i: number) => (
				<FormRadio id={`f-sex-${s}`} label={`${icos[s.toLocaleLowerCase()]} ${Sexes[s].title}`} name="sex" value={s} isChecked={s === fields.sex} key={i} onChange={onChange} />
			))}
		</FormField>
	</div>
);

export default Step1;
