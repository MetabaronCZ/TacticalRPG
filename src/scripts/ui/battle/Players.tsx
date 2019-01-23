import React from 'react';

import { Icos, IcoID } from 'data/icos';

import Act from 'modules/battle/act';
import AIPlayer from 'modules/ai/player';
import Player from 'modules/battle/player';

import ArchetypeIco from 'ui/common/ArchetypeIco';

interface IPlayersProps {
	act: Act|null;
	players: Array<Player|AIPlayer>;
}

const formatInteger = (nr: number, ciphers: number): string => {
	const result = nr + '';

	if (result.length > ciphers) {
		throw new Error('Ciphers count should at least input number ciphers count');
	}
	const fill = Array(ciphers - result.length).fill(0).join('');
	return fill + result;
};

const Players: React.SFC<IPlayersProps> = ({ act, players }) => (
	<div className="Players">
		{players.map((pl, p) => (
			<div className="Players-item" key={p}>
				<h3 className="Heading">
					{pl.getName()} ({pl instanceof AIPlayer ? 'AI' : 'HUMAN'} Player)
				</h3>

				<table className="Players-item-characters">
					<thead>
						<tr>
							<th>Name</th>
							<th className="Players-item-characters-heading">HP</th>
							<th className="Players-item-characters-heading">AP</th>
							<th className="Players-item-characters-heading">ARM</th>
							<th className="Players-item-characters-heading">ESH</th>
						</tr>
					</thead>

					<tbody>
						{pl.getCharacters().map((char, c) => {
							const isDead = char.isDead();
							const isActive = !!(act && act.getActor() === char);
							const state = (isDead ? 'is-dead' : (isActive ? 'is-active' : ''));

							const { HP, AP, ARM, ESH } = char.attributes;
							const { HP: baseHP, AP: baseAP, ARM: baseARM, ESH: baseESH } = char.baseAttributes;

							return (
								<tr className={`Players-item-characters-item ${state}`} key={c}>
									<td className="Players-item-characters-item-row">
										<strong>{char.name}</strong>
										{' '}{Icos[char.sex.id.toLowerCase() as IcoID]}
										{' '}<ArchetypeIco archetype={char.archetype.id} />
									</td>

									<td className="Players-item-characters-item-row Players-item-characters-item-row--number">
										{formatInteger(HP, 3)} <span className="Players-item-characters-item-base">/ {formatInteger(baseHP, 3)}</span>
									</td>

									<td className="Players-item-characters-item-row Players-item-characters-item-row--number">
										{formatInteger(AP, 2)} <span className="Players-item-characters-item-base">/ {formatInteger(baseAP, 2)}</span>
									</td>

									<td className="Players-item-characters-item-row Players-item-characters-item-row--number">
										{formatInteger(ARM, 3)} <span className="Players-item-characters-item-base">/ {formatInteger(baseARM, 3)}</span>
									</td>

									<td className="Players-item-characters-item-row Players-item-characters-item-row--number">
										{formatInteger(ESH, 3)} <span className="Players-item-characters-item-base">/ {formatInteger(baseESH, 3)}</span>
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
