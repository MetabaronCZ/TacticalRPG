import React from 'react';

import { ICharacter } from 'modules/character';
import { previewCasterInfo } from 'modules/battle/combat';
import Command, { formatCost } from 'modules/battle/command';
import { StatusEffectID } from 'modules/battle/status-effect';

import WeaponIco from 'ui/common/WeaponIco';
import ElementIco from 'ui/common/ElementIco';
import CombatInfo from 'ui/battle/CombatInfo';
import CommandTitle from 'ui/battle/CommandTitle';

interface IProps {
	readonly character: ICharacter;
	readonly command: Command;
}

const CommandInfo: React.SFC<IProps> = ({ character, command }) => {
	const { cost, skills} = command;
	let status: StatusEffectID[] = [];

	for (const skill of skills) {
		status = [...status, ...skill.status];
	}

	const casterInfo = previewCasterInfo(character, skills);
	const isSupport = (!!casterInfo && casterInfo.isSupport);
	const casterSkills = (casterInfo ? casterInfo.skills : []);

	const label = (isSupport ? 'Healing' : 'Attack value');

	return (
		<React.Fragment>
			<div className="u-text-default">
				<strong>Command:</strong> <CommandTitle command={command} />
			</div>
	
			{!!cost && (
				<CombatInfo label="Cost">
					{formatCost(cost)}
				</CombatInfo>
			)}
	
			{casterSkills.length > 0 && (
				<CombatInfo label={label} small={false}>
					{casterSkills.map(({ skill, damage, healing }, i) => (
						<React.Fragment key={i}>
							{'NONE' !== skill.weapon && (
								<WeaponIco weapon={skill.weapon} />
							)}
							{'NONE' !== skill.element && (
								<ElementIco element={skill.element} />
							)}
							{isSupport ? healing : damage}
							{i < casterSkills.length - 1 ? ' + ' : ''}
						</React.Fragment>
					))}
				</CombatInfo>
			)}

			{status.length > 0 && (
				<CombatInfo label="Added effect">
					{status.join(', ')}
				</CombatInfo>
			)}
		</React.Fragment>
	);
};

export default CommandInfo;
