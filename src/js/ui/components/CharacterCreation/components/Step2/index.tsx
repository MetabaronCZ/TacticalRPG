import React from 'react';

import ArchetypeSelection from 'ui/components/ArchetypeSelection';
import FormField from 'ui/components/FormField';
import FormSelect from 'ui/components/FormSelect';
import FormSelectItem from 'ui/components/FormSelectItem';

import Jobs from 'data/jobs';
import { filter as filterJobs } from 'utils/character/jobs';
import { ICharacter } from 'models/character';
import { JobID } from 'models/job';

interface IStep2Props {
	fields: ICharacter;
	onChange: () => void;
}

const Step2 = ({ fields, onChange }: IStep2Props): JSX.Element => (
	<div>
		<ArchetypeSelection primary={fields.primary} secondary={fields.secondary} onChange={onChange} />

		<FormField fieldId="f-job" label="Character Job" info={fields.job ? Jobs[fields.job].description : undefined}>
			<FormSelect id="f-job" name="job" value={fields.job} onChange={onChange}>
				{filterJobs(fields).map((job: JobID, i: number) => (
					<FormSelectItem value={job} key={i}>
						{Jobs[job].title}
					</FormSelectItem>
				))}
			</FormSelect>
		</FormField>
	</div>
);

export default Step2;
