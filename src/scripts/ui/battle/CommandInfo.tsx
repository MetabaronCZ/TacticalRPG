import React from 'react';

import Command, { formatCost } from 'modules/battle/command';
import { StatusEffectID } from 'modules/battle/status-effect';
import { ICasterCombatPreview, ICasterPreviewItem } from 'modules/battle/combat';

import WeaponIco from 'ui/common/WeaponIco';
import ElementIco from 'ui/common/ElementIco';
import CombatInfo from 'ui/battle/CombatInfo';
import CommandTitle from 'ui/battle/CommandTitle';
import { backAttackModifier } from 'data/combat';

interface IProps {
	readonly preview: ICasterCombatPreview | null;
	readonly command: Command;
}

const CommandInfo: React.SFC<IProps> = ({ preview, command }) => {
	const { cost } = command;

	let damageSkills: ICasterPreviewItem[] = [];
	let healingSkills: ICasterPreviewItem[] = [];
	let status: StatusEffectID[] = [];
	let isBackAttack = false;

	if (preview) {
		damageSkills = preview.damageSkills;
		healingSkills = preview.healingSkills;
		isBackAttack = preview.backAttack;
		status = preview.status;
	}

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

			{isBackAttack && (
				<CombatInfo label="Back attack">
					x{backAttackModifier}
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
