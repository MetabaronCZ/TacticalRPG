import React from 'react';

import ArchetypeIco from 'ui/components/ArchetypeIco';
import Bar from 'ui/components/Game/components/Bar';

import icos from 'data/icos';
import { Jobs } from 'models/job';
import { Character } from 'models/character';

interface IPartyProps {
	characters: Character[];
}

const Party: React.SFC<IPartyProps> = ({ characters }) => (
	<div className="Party">
		<h2 className="Heading">
			Party
		</h2>

		{characters.map((char, i) => {
			const attrs = char.getAttributes();
			const job = Jobs.get(char.job);

			return (
				<div className="Party-item" key={i}>
					{char.name} <ArchetypeIco primary={char.primary} secondary={char.secondary} /> {icos[char.sex.toLowerCase()]} {job.title}

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
