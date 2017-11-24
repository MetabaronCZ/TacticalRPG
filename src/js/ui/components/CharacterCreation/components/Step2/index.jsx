import React from 'react';

import ArchetypeSelection from 'ui/components/ArchetypeSelection';
import FormField from 'ui/components/FormField';
import FormSelect from 'ui/components/FormSelect';
import FormSelectItem from 'ui/components/FormSelectItem';

import Jobs from 'data/jobs';
import { filter as filterJobs } from 'utils/character/jobs';

const Step2 = ({ fields, onChange }) => (
	<div>
		<ArchetypeSelection primary={fields.primary} secondary={fields.secondary} onChange={onChange} />

		<FormField fieldId="f-job" label="Character Job" info={fields.job ? Jobs[fields.job].description : null}>
			<FormSelect id="f-job" name="job" value={fields.job} onChange={onChange}>
				{filterJobs(fields).map((cls, i) => (
					<FormSelectItem value={cls} key={i}>
						{Jobs[cls].title}
					</FormSelectItem>
				))}
			</FormSelect>
		</FormField>
	</div>
);

export default Step2;
