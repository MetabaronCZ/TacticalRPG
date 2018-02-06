import React, { SyntheticEvent } from 'react';

import FormField from 'ui/components/FormField';
import FormInput from 'ui/components/FormInput';
import FormRadio from 'ui/components/FormRadio';

import { maxNameLength } from 'utils/character';
import icos from 'utils/icos';

import SexList from 'data/sex-list';
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
			{Array.from(SexList.entries()).map(([id, sex], i) => {
				return (
					<FormRadio id={`f-sex-${id}`} label={`${icos[id.toLocaleLowerCase()]} ${sex ? sex.title : ''}`} name="sex" value={id} isChecked={id === fields.sex} key={i} onChange={onChange} />
				);
			})}
		</FormField>
	</div>
);

export default Step1;
