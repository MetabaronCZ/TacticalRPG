import React from 'react';

import { Icos, IcoID } from 'data/icos';
import Character from 'modules/character';
import BarValue from 'ui/battle/BarValue';
import ArchetypeIco from 'ui/common/ArchetypeIco';

interface IProps {
	readonly character: Character;
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
						<td className="Table-column">HP:</td>
						<td className="Table-column"><BarValue value={HP} max={baseHP} /></td>
						<td className="Table-column">
							<span className="u-disabled">|</span>
						</td>
						<td className="Table-column">MH:</td>
						<td className="Table-column">{char.mainHand.title}</td>
					</tr>
					<tr>
						<td className="Table-column">MP:</td>
						<td className="Table-column"><BarValue value={MP} max={baseMP} /></td>
						<td className="Table-column">
							<span className="u-disabled">|</span>
						</td>
						<td className="Table-column">OH:</td>
						<td className="Table-column">
							{'NONE' !== char.offHand.id
								? char.offHand.title
								: <span className="u-disabled">{char.mainHand.title}</span>
							}
						</td>
					</tr>
					<tr>
						<td className="Table-column">AP:</td>
						<td className="Table-column"><BarValue value={AP} max={baseAP} /></td>
						<td className="Table-column">
							<span className="u-disabled">|</span>
						</td>
						<td className="Table-column">AR:</td>
						<td className="Table-column">{char.armor.title}</td>
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
