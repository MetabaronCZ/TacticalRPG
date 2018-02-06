import React from 'react';

import ArchetypeSelection from 'ui/components/ArchetypeSelection';
import FormField from 'ui/components/FormField';
import FormSelect from 'ui/components/FormSelect';
import FormSelectItem from 'ui/components/FormSelectItem';

import JobList from 'data/job-list';
import { filter as filterJobs } from 'utils/jobs';
import { ICharacter } from 'models/character';

interface IStep2Props {
	fields: ICharacter;
	onChange: () => void;
}

const Step2 = ({ fields, onChange }: IStep2Props): JSX.Element => {
	const job = JobList.get(fields.job);

	return (
		<div>
			<ArchetypeSelection primary={fields.primary} secondary={fields.secondary} onChange={onChange} />

			<FormField fieldId="f-job" label="Character Job" info={fields.job && job ? job.description : undefined}>
				<FormSelect id="f-job" name="job" value={fields.job} onChange={onChange}>
					{Array.from(filterJobs(fields).entries()).map(([id, value], i) => (
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
