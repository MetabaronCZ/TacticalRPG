import React from 'react';

import { Jobs } from 'modules/job';
import { Skillsets } from 'modules/skillset';

import FormField from 'components/FormField';
import FormSelect from 'components/FormSelect';
import FormSelectItem from 'components/FormSelectItem';
import ArchetypeSelection from 'components/ArchetypeSelection';
import { IStepProps } from 'components/CharacterCreation';

const Step2: React.SFC<IStepProps> = ({ fields, onChange }) => {
	const job = Jobs.get(fields.job);
	const skillset = Skillsets.get(fields.skillset);

	const skillsets = job.skillsets.map(id => ({
		id,
		set: Skillsets.get(id)
	}));

	return (
		<React.Fragment>
			<ArchetypeSelection primary={fields.primary} secondary={fields.secondary} onChange={onChange} />

			<FormField fieldId="f-job" label="Character Job" info={job ? job.description : undefined}>
				<FormSelect id="f-job" name="job" value={fields.job} onChange={onChange}>
					{Jobs.filter(fields).map(([id, value], i) => (
						<FormSelectItem value={id} key={i}>
							{value.title}
						</FormSelectItem>
					))}
				</FormSelect>
			</FormField>

			<FormField fieldId="f-skillset" label="Skillset" info={skillset ? skillset.description : undefined}>
				<FormSelect id="f-skillset" name="skillset" value={fields.skillset} disabled={skillsets.length < 2} onChange={onChange}>
					{skillsets.map(({ id, set }, i) => (
						<FormSelectItem value={id} key={i}>
							{set.title}
						</FormSelectItem>
					))}
				</FormSelect>
			</FormField>
		</React.Fragment>
	);
};

export default Step2;
