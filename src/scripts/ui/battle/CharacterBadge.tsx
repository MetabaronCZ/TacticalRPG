import React from 'react';

import { Icos, IcoID } from 'data/icos';
import Character from 'modules/character';
import ArchetypeIco from 'ui/common/ArchetypeIco';
import { formatInteger } from 'core/number';

interface IProps {
	character: Character;
}

const CharacterBadge: React.SFC<IProps> = ({ character }) => {
	const { archetype, sex, skillset, mainHand, offHand, armor, status } = character;
	const { HP, AP, MP } = character.attributes;
	const { HP: baseHP, AP: baseAP, MP: baseMP } = character.baseAttributes;

	return (
		<div className="u-mt-3">
			{character.player.name} > {character.name} {Icos[sex.id.toLowerCase() as IcoID]}
			{' '}
			<ArchetypeIco archetype={archetype.id} />
			{' '}
			{archetype.title}{archetype.type.M ? ' (' + skillset.title + ')' : ''}
			<br />

			{mainHand.title}{'NONE' !== offHand.id ? ' + ' + offHand.title : ''} | {armor.title}
			<br />

			<table>
				<tbody>
					<tr>
						<td>HP: {formatInteger(HP, 3)} <span className="u-disabled">/ {formatInteger(baseHP, 3)}</span></td>
						<td>
							<div className="u-ml-1">
								MP: {formatInteger(MP, 3)} <span className="u-disabled">/ {formatInteger(baseMP, 3)}</span>
							</div>
						</td>
						<td>
							<div className="u-ml-1">
								AP: {formatInteger(AP, 2)} <span className="u-disabled">/ {formatInteger(baseAP, 2)}</span>
							</div>
						</td>
					</tr>
				</tbody>
			</table>

			Status: {status.get().map(st => `${st.effect} (${st.duration})`).join(', ')}
		</div>
	);
};

export default CharacterBadge;
