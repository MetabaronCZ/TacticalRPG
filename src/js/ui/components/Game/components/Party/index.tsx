import React from 'react';
import ArchetypeIco from 'ui/components/ArchetypeIco';
import Bar from 'ui/components/Game/components/Bar';

import Character, { ICharacterAttributes } from 'engine/character';
import icos from 'utils/icos';
import JobList from 'data/job-list';
import { IJob } from 'models/job';

interface IPartyProps {
	characters: Character[];
}

const Party = ({ characters }: IPartyProps): JSX.Element => (
	<div className="Party">
		<h2 className="Heading">
			Party
		</h2>

		{characters.map((char: Character, i: number) => {
			const attrs: ICharacterAttributes = char.getAttributes();
			const job: IJob|undefined = JobList.get(char.job);

			return (
				<div className="Party-item" key={i}>
					{char.name} <ArchetypeIco primary={char.primary} secondary={char.secondary} /> {icos[char.sex.toLowerCase()]} {job ? job.title : ''}

					<Bar
						hp={attrs.current.HP}
						hpMax={attrs.base.HP}
						ap={attrs.current.AP}
						apMax={attrs.base.AP}
					/>
				</div>
			);
		})}
	</div>
);

export default Party;
