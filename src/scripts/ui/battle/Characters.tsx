import React from 'react';

import { Icos, IcoID } from 'data/icos';

import Act from 'engine/act';
import Player from 'engine/player';

import ArchetypeIco from 'ui/common/ArchetypeIco';

interface ICharactersProps {
	act: Act|null;
	players: Player[];
}

const Characters: React.SFC<ICharactersProps> = ({ act, players }) => (
	<div>
		{players.map((pl, p) => (
			<div style={{ marginBottom: '20px', }} key={p}>
				<h3 className="Heading">
					{pl.name} ({pl.control} Player)
				</h3>

				<table style={{ width: '100%', borderCollapse: 'collapse', }}>
					<thead>
						<tr>
							<th>Name</th>
							<th style={{ textAlign: 'right', paddingLeft: '5px', }}>HP</th>
							<th style={{ textAlign: 'right', paddingLeft: '5px', }}>AP</th>
						</tr>
					</thead>

					<tbody>
						{pl.characters.map((char, c) => {
							const isActive = !!(act && act.getActor() === char);
							const isDead = char.isDead();
							const HP = char.attributes.get('HP');
							const AP = char.attributes.get('AP');
							const baseHP = char.baseAttributes.get('HP');
							const baseAP = char.baseAttributes.get('AP');
							const color = (isDead ? 'darkred' : (isActive ? 'black' : ''));

							return (
								<tr key={c} style={{ backgroundColor: color, }}>
									<td>
										<strong>{char.name}</strong>
										{' '}{Icos[char.sex.toLowerCase() as IcoID]}
										{' '}<ArchetypeIco archetype={char.archetype} />
									</td>
									<td style={{ textAlign: 'right', paddingLeft: '10px', }}>
										{HP} <span style={{ color: 'grey', }}>/ {baseHP}</span>
									</td>
									<td style={{ textAlign: 'right', paddingLeft: '10px', }}>
										{AP} <span style={{ color: 'grey', }}>/ {baseAP}</span>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		))}
	</div>
);

export default Characters;
