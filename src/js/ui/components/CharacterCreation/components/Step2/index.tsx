import React from 'react';

import FormField from 'ui/components/FormField';
import FormSelect from 'ui/components/FormSelect';
import FormSelectItem from 'ui/components/FormSelectItem';
import ArchetypeSelection from 'ui/components/ArchetypeSelection';

import { Jobs } from 'models/job';
import { ICharacterData } from 'models/character';

interface IStep2Props {
	fields: ICharacterData;
	onChange: () => void;
}

const Step2: React.SFC<IStep2Props> = ({ fields, onChange }) => {
	const job = Jobs.get(fields.job);

	return (
		<div>
			<ArchetypeSelection primary={fields.primary} secondary={fields.secondary} onChange={onChange} />

			<FormField fieldId="f-job" label="Character Job" info={fields.job && job ? job.description : undefined}>
				<FormSelect id="f-job" name="job" value={fields.job} onChange={onChange}>
					{Jobs.filter(fields).map((id, value, i) => (
						<FormSelectItem value={id} key={i}>
							{value.title}
						</FormSelectItem>
					))}
				</FormSelect>
			</FormField>
		</div>
	);
};

export default Step2;
