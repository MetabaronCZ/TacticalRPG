import React from 'react';

import { ICharacter } from 'modules/character';
import { CharacterData } from 'modules/character-creation/character-data';

import { formatCharacter } from 'ui/format';
import AttributeInfo from 'ui/battle/AttributeInfo';

interface IProps {
	readonly character: ICharacter;
}

const CharactertInfo: React.SFC<IProps> = ({ character: char }) => {
	const { HP: baseHP, AP: baseAP, MP: baseMP } = char.baseAttributes;
	const { HP, AP, MP } = char.attributes;
	const st = char.status;

	const data = CharacterData.from(char);

	return (
		<React.Fragment>
			<h1 className="Heading">
				<div className="Layout">
					<div className="Layout-row">
						<div className="Layout-column">
							{char.name}
						</div>

						<div className="Layout-column u-align-right">
							{formatCharacter(data)}
						</div>
					</div>
				</div>
			</h1>

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
