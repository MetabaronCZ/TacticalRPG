import React from 'react';

import { Icos, IcoID } from 'data/icos';
import Character from 'modules/character';

import BarValue from 'ui/battle/BarValue';
import ArmorIco from 'ui/common/ArmorIco';
import WeaponIco from 'ui/common/WeaponIco';
import ElementIco from 'ui/common/ElementIco';
import ArchetypeIco from 'ui/common/ArchetypeIco';

const offset = 8; // Tooltip triangle size

interface IProps {
	readonly x: number; // in pct
	readonly y: number; // in pct
	readonly size: number; // item size
	readonly character: Character;
}

const CharacterTooltip: React.SFC<IProps> = ({ x, y, size, character: char }) => {
	const { archetype, skillset } = char;
	const { HP, AP, MP } = char.attributes;
	const { HP: baseHP, AP: baseAP, MP: baseMP } = char.baseAttributes;

	const status = char.status.get();
	const sex = Icos[char.sex.id.toLowerCase() as IcoID];

	return (
		<div
			className="Tooltip"
			style={{
				left: x + '%',
				top: y + '%',
				marginLeft: Math.ceil(size + offset) + 'px'
			}}
		>
			<div>
				<strong>{char.name}</strong>
				{' '}
				{sex}
				{' '}
				<ArchetypeIco archetype={archetype.id} />
				{' '}
				<ElementIco element={skillset.element} minimal />
			</div>

			<table className="Table Table--plain">
				<tbody>
					<tr>
						<td className="Table-column">HP:</td>
						<td className="Table-column"><BarValue value={HP} max={baseHP} /></td>
						<td className="Table-column">
							<span className="u-disabled">|</span>
						</td>
						<td className="Table-column">
							<WeaponIco weapon={char.mainHand.id} />
							{char.mainHand.title}
						</td>
					</tr>
					<tr>
						<td className="Table-column">MP:</td>
						<td className="Table-column"><BarValue value={MP} max={baseMP} /></td>
						<td className="Table-column">
							<span className="u-disabled">|</span>
						</td>
						<td className="Table-column">
							{'NONE' !== char.offHand.id
								? (
									<React.Fragment>
										<WeaponIco weapon={char.offHand.id} />
										{char.offHand.title}
									</React.Fragment>
								)
								: (
									<span className="u-disabled">
										<WeaponIco weapon={char.mainHand.id} />
										{char.mainHand.title}
									</span>
								)
							}
						</td>
					</tr>
					<tr>
						<td className="Table-column">AP:</td>
						<td className="Table-column"><BarValue value={AP} max={baseAP} /></td>
						<td className="Table-column">
							<span className="u-disabled">|</span>
						</td>
						<td className="Table-column">
							<ArmorIco armor={char.armor.id} />
							{char.armor.title}
						</td>
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
