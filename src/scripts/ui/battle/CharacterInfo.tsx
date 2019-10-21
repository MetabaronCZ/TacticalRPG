import React from 'react';

import { ICharacterSnapshot } from 'modules/character';
import { reactiveEffects } from 'modules/battle/status-effect';

import { formatCharacter } from 'ui/format';
import AttributeInfo from 'ui/battle/AttributeInfo';

interface IProps {
	readonly character: ICharacterSnapshot;
}

const CharactertInfo: React.SFC<IProps> = ({ character: char }) => {
	const { HP, AP, MP } = char.attributes;
	const { HP: baseHP, AP: baseAP, MP: baseMP } = char.baseAttributes;
	const st = char.status.filter(eff => !reactiveEffects.includes(eff.id));

	return (
		<React.Fragment>
			<h1 className="Heading">
				<div className="Layout">
					<div className="Layout-row">
						<div className="Layout-column">
							{char.name}
						</div>

						<div className="Layout-column u-align-right">
							{formatCharacter(char.data)}
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
