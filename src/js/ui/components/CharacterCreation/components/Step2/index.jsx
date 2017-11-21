import React from 'react';

import ArchetypeSelection from 'ui/components/ArchetypeSelection';
import FormField from 'ui/components/FormField';
import FormSelect from 'ui/components/FormSelect';
import FormSelectItem from 'ui/components/FormSelectItem';

import characterClass from 'data/class';
import { filter as filterClass } from 'utils/character/class';

const Step2 = ({ fields, onChange }) => (
	<div>
		<ArchetypeSelection primary={fields.primary} secondary={fields.secondary} onChange={onChange} />

		<FormField fieldId="f-class" label="Character class" info={fields.class ? characterClass[fields.class].description : null}>
			<FormSelect id="f-class" name="class" value={fields.class} onChange={onChange}>
				{filterClass(fields).map((cls, i) => (
					<FormSelectItem value={cls} key={i}>
						{characterClass[cls].title}
					</FormSelectItem>
				))}
			</FormSelect>
		</FormField>
	</div>
);

export default Step2;
