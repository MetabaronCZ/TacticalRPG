import React from 'react';

import icos from 'data/icos';
import { Jobs } from 'models/job';
import { PlayerType } from 'models/player';
import { ICharacter } from 'models/character';

import Bar from 'components/Game/components/Bar';
import ArchetypeIco from 'components/ArchetypeIco';

interface IPartyProps {
	characters: ICharacter[];
}

const Party: React.SFC<IPartyProps> = ({ characters }) => {
	const ally = characters.filter((char) => PlayerType.ALLY === char.player);

	return (
		<div className="Party">
			<h2 className="Heading">
				Party
			</h2>

			{ally.map((char, i) => {
				const job = Jobs.get(char.data.job);

				return (
					<div className="Party-item" key={i}>
						{char.data.name} <ArchetypeIco primary={char.data.primary} secondary={char.data.secondary} /> {icos[char.data.sex.toLowerCase()]} {job.title}

						<Bar
							hp={char.currAttributes.HP}
							hpMax={char.baseAttributes.HP}
							ap={char.currAttributes.AP}
							apMax={char.baseAttributes.AP}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default Party;
