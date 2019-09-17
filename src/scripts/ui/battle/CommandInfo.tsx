import React from 'react';

import { ICharacterSnapshot } from 'modules/character';
import { previewCasterInfo } from 'modules/battle/combat';
import Command, { formatCost } from 'modules/battle/command';
import { StatusEffectID } from 'modules/battle/status-effect';

import WeaponIco from 'ui/common/WeaponIco';
import ElementIco from 'ui/common/ElementIco';
import CombatInfo from 'ui/battle/CombatInfo';
import CommandTitle from 'ui/battle/CommandTitle';

interface IProps {
	readonly character: ICharacterSnapshot;
	readonly command: Command;
}

const CommandInfo: React.SFC<IProps> = ({ character, command }) => {
	const { cost } = command;
	let status: StatusEffectID[] = [];

	for (const skill of command.skills) {
		status = [...status, ...skill.status];
	}
	const { damageSkills, healingSkills } = previewCasterInfo(character, command.skills);

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

			{healingSkills.length > 0 && (
				<CombatInfo label="Healing" small={false}>
					{healingSkills.map(({ skill, value }, i) => (
						<React.Fragment key={i}>
							{'NONE' !== skill.element && (
								<ElementIco element={skill.element} />
							)}
							{value}
							{i < healingSkills.length - 1 ? ' + ' : ''}
						</React.Fragment>
					))}
				</CombatInfo>
			)}
	
			{damageSkills.length > 0 && (
				<CombatInfo label="Attack value" small={false}>
					{damageSkills.map(({ skill, value }, i) => (
						<React.Fragment key={i}>
							{'NONE' !== skill.weapon && (
								<WeaponIco weapon={skill.weapon} />
							)}
							{'NONE' !== skill.element && (
								<ElementIco element={skill.element} />
							)}
							{value}
							{i < damageSkills.length - 1 ? ' + ' : ''}
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
