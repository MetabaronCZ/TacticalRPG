import React from 'react';

import icos from 'data/icos';
import { PlayerType } from 'modules/player/types';
import { ICharacter } from 'modules/character/types';

import Bar from 'ui/battle/BattleUI/components/Bar';
import ArchetypeIco from 'ui/common/ArchetypeIco';

interface IPartyProps {
	readonly characters: ICharacter[];
}

const Party: React.SFC<IPartyProps> = ({ characters }) => {
	const ally = characters.filter(char => PlayerType.ALLY === char.player);

	return (
		<div className="Party">
			<h2 className="Heading">
				Party
			</h2>

			{ally.map((char, i) => (
				<div className="Party-item" key={i}>
					{char.data.name}
					{' '}
					<ArchetypeIco archetype={char.data.archetype} />
					{' '}
					{icos[char.data.sex.toLowerCase()]}

					<Bar
						hp={char.currAttributes.HP}
						hpMax={char.baseAttributes.HP}
						ap={char.currAttributes.AP}
						apMax={char.baseAttributes.AP}
					/>
				</div>
			))}
		</div>
	);
};

export default Party;