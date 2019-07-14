import React from 'react';

import { Icos, IcoID } from 'data/icos';
import Character from 'modules/character';

import ArchetypeIco from 'ui/common/ArchetypeIco';
import AttributeInfo from 'ui/battle/AttributeInfo';

interface IProps {
	readonly character: Character;
}

const CharactertInfo: React.SFC<IProps> = ({ character: char }) => {
	const { archetype, sex, skillset, mainHand, offHand, armor, status } = char;
	const { HP, AP, MP } = char.attributes;
	const { HP: baseHP, AP: baseAP, MP: baseMP } = char.baseAttributes;
	const st = status.get();
	return (
		<React.Fragment>
			<h1 className="Heading">
				{char.name}
			</h1>

			<p className="Paragraph">
				{Icos[sex.id.toLowerCase() as IcoID]}
				{' '}
				<ArchetypeIco archetype={archetype.id} />
				{' '}
				{archetype.title}{archetype.type.M ? ' (' + skillset.title + ')' : ''}
				<br />
				{mainHand.title}{'NONE' !== offHand.id ? ' + ' + offHand.title : ''} | {armor.title}
			</p>

			<AttributeInfo label="HP" color="green" value={HP} max={baseHP} />
			<AttributeInfo label="MP" color="blue" value={MP} max={baseMP} disabled={baseMP <= 0} />
			<AttributeInfo label="AP" color="yellow" value={AP} max={baseAP} />

			{st.length > 0 && (
				<p className="Paragraph">
					<strong>Status:</strong> {st.map(s => `${s.effect} (${s.duration.value})`).join(', ')}
				</p>
			)}
		</React.Fragment>
	);
};

export default CharactertInfo;
