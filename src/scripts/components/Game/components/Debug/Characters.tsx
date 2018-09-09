import React from 'react';

import Icos from 'data/icos';

import Act from 'engine/act';
import Player from 'engine/player';

import ArchetypeIco from 'components/ArchetypeIco';

interface ICharactersProps {
	act: Act|null;
	players: Player[];
}

const Characters: React.SFC<ICharactersProps> = ({ act, players }) => (
	<div>
		{players.map((pl, p) => (
			<div style={{ marginBottom: '10px', }} key={p}>
				<h3>Player {p} ({pl.getControl()})</h3>

				<table style={{ width: '100%', borderCollapse: 'collapse', }}>
					<thead>
						<tr>
							<th>Name</th>
							<th style={{ textAlign: 'right', paddingLeft: '5px', }}>HP</th>
							<th style={{ textAlign: 'right', paddingLeft: '5px', }}>AP</th>
						</tr>
					</thead>

					<tbody>
						{pl.getCharacters().map((char, c) => {
							const { name, sex, archetype } = char.getData();
							const isActive = !!(act && act.getActor() === char);
							const isDead = char.isDead();
							const HP = char.getAttribute('HP');
							const AP = char.getAttribute('AP');
							const baseHP = char.getBaseAttribute('HP');
							const baseAP = char.getBaseAttribute('AP');
							const color = (isDead ? 'darkred' : (isActive ? 'black' : ''));

							return (
								<tr key={c} style={{ backgroundColor: color, }}>
									<td>
										<strong>{name}</strong>
										{' '}{Icos[sex.toLowerCase()]}
										{' '}<ArchetypeIco archetype={archetype} />
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
