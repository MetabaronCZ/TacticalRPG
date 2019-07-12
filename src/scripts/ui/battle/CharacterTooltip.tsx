import React from 'react';

import { Icos, IcoID } from 'data/icos';
import Character from 'modules/character';
import BarValue from 'ui/battle/BarValue';
import ArchetypeIco from 'ui/common/ArchetypeIco';

interface IProps {
	character: Character;
}

const CharacterTooltip: React.SFC<IProps> = ({ character: char }) => {
	const { archetype, skillset } = char;
	const { HP, AP, MP } = char.attributes;
	const { HP: baseHP, AP: baseAP, MP: baseMP } = char.baseAttributes;
	const status = char.status.get();
	const sex = Icos[char.sex.id.toLowerCase() as IcoID];
	return (
		<div className="Tooltip">
			<div>
				<strong>{char.name}</strong>
				{' '}
				{sex}
				{' '}
				<ArchetypeIco archetype={archetype.id} />
				{' '}
				{archetype.title}{archetype.type.M ? ' (' + skillset.element + ')' : ''}
			</div>

			<table className="Table Table--plain">
				<tbody>
					<tr>
						<td>HP:</td>
						<td><BarValue value={HP} max={baseHP} /></td>
						<td className="u-disabled">|</td>
						<td>MH:</td>
						<td>{char.mainHand.title}</td>
					</tr>
					<tr>
						<td>MP:</td>
						<td><BarValue value={MP} max={baseMP} /></td>
						<td className="u-disabled">|</td>
						<td>OH:</td>
						<td>
							{'NONE' !== char.offHand.id
								? char.offHand.title
								: <span className="u-disabled">{char.mainHand.title}</span>
							}
						</td>
					</tr>
					<tr>
						<td>AP:</td>
						<td><BarValue value={AP} max={baseAP} /></td>
						<td className="u-disabled">|</td>
						<td>AR:</td>
						<td>{char.armor.title}</td>
					</tr>
				</tbody>
			</table>

			{status.length > 0 && (
				<div>
					Status: {status.map(st => `${st.effect} (${st.duration.value})`).join(', ')}
				</div>
			)}
		</div>
	);
};

export default CharacterTooltip;
