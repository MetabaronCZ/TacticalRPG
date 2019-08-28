import React from 'react';

import { Icos, IcoID } from 'data/icos';
import Character from 'modules/character';

import BarValue from 'ui/battle/BarValue';
import ArmorIco from 'ui/common/ArmorIco';
import WeaponIco from 'ui/common/WeaponIco';
import ElementIco from 'ui/common/ElementIco';
import ArchetypeIco from 'ui/common/ArchetypeIco';

type TooltipOrientation = 'top' | 'bottom';

interface IProps {
	readonly character: Character;
	readonly x: number; // 0% - 100%
	readonly y: number; // 0% - 100%
	readonly size: number; // item size
	readonly orientation: TooltipOrientation;
}

const CharacterTooltip: React.SFC<IProps> = ({ x, y, size, orientation, character: char }) => {
	const { archetype, skillset } = char;
	const { HP, AP, MP } = char.attributes;
	const { HP: baseHP, AP: baseAP, MP: baseMP } = char.baseAttributes;

	const status = char.status.get();
	const sex = Icos[char.sex.id.toLowerCase() as IcoID];

	return (
		<div
			className={`Tooltip Tooltip--${orientation}`}
			style={{
				left: x + '%',
				top: y + '%',
				marginLeft: Math.ceil(size) + 'px'
			}}
		>
			<div className="Tooltip-inner">
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
		</div>
	);
};

export default CharacterTooltip;
