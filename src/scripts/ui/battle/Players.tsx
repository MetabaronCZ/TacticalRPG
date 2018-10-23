import React from 'react';

import { Icos, IcoID } from 'data/icos';

import Act from 'modules/battle/act';
import Player from 'modules/battle/player';

import ArchetypeIco from 'ui/common/ArchetypeIco';

interface IPlayersProps {
	act: Act|null;
	players: Player[];
}

const Players: React.SFC<IPlayersProps> = ({ act, players }) => (
	<div className="Players">
		{players.map((pl, p) => (
			<div className="Players-item" key={p}>
				<h3 className="Heading">
					{pl.name} ({pl.control} Player)
				</h3>

				<table className="Players-item-characters">
					<thead>
						<tr>
							<th>Name</th>
							<th className="Players-item-characters-heading">HP</th>
							<th className="Players-item-characters-heading">AP</th>
						</tr>
					</thead>

					<tbody>
						{pl.characters.map((char, c) => {
							const isDead = char.isDead();
							const isActive = !!(act && act.getActor() === char);
							const state = (isDead ? 'is-dead' : (isActive ? 'is-active' : ''));

							const { HP, AP } = char.attributes;
							const { HP: baseHP, AP: baseAP } = char.baseAttributes;

							return (
								<tr className={`Players-item-characters-item ${state}`} key={c}>
									<td className="Players-item-characters-item-row">
										<span className="u-weight-bold">{char.name}</span>
										{' '}{Icos[char.sex.id.toLowerCase() as IcoID]}
										{' '}<ArchetypeIco archetype={char.archetype.id} />
									</td>

									<td className="Players-item-characters-item-row Players-item-characters-item-row--number">
										{HP} <span className="Players-item-characters-item-base">/ {baseHP}</span>
									</td>

									<td className="Players-item-characters-item-row Players-item-characters-item-row--number">
										{AP} <span className="Players-item-characters-item-base">/ {baseAP}</span>
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

export default Players;
