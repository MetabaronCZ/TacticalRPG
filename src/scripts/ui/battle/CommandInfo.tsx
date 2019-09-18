import React from 'react';

import { backAttackModifier } from 'data/combat';

import Command, { formatCost } from 'modules/battle/command';
import { StatusEffectID } from 'modules/battle/status-effect';
import { ICasterCombatPreview, ICasterPreviewItem, ICasterPreviewAffinity } from 'modules/battle/combat';

import WeaponIco from 'ui/common/WeaponIco';
import ElementIco from 'ui/common/ElementIco';
import CombatInfo from 'ui/battle/CombatInfo';
import CommandTitle from 'ui/battle/CommandTitle';

interface IProps {
	readonly preview: ICasterCombatPreview | null;
	readonly command: Command;
}

const CommandInfo: React.SFC<IProps> = ({ preview, command }) => {
	const { cost } = command;

	let physicalSkills: ICasterPreviewItem[] = [];
	let magicalSkills: ICasterPreviewItem[] = [];
	let healingSkills: ICasterPreviewItem[] = [];
	let affinities: ICasterPreviewAffinity[] = [];
	let status: StatusEffectID[] = [];
	let isBackAttack = false;

	if (preview) {
		physicalSkills = preview.physicalSkills;
		magicalSkills = preview.magicalSkills;
		healingSkills = preview.healingSkills;
		isBackAttack = preview.backAttack;
		affinities = preview.affinity;
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
							<ElementIco element={skill.element} />
							{' '}
							{value}{i < healingSkills.length - 1 ? ' + ' : ''}
						</React.Fragment>
					))}
				</CombatInfo>
			)}
	
			{physicalSkills.length > 0 && (
				<CombatInfo label="Physical attack" small={false}>
					{physicalSkills.map(({ skill, value }, i) => (
						<React.Fragment key={i}>
							<WeaponIco weapon={skill.weapon} minimal />
							{' '}
							{value}{i < physicalSkills.length - 1 ? ' + ' : ''}
						</React.Fragment>
					))}
				</CombatInfo>
			)}

			{magicalSkills.length > 0 && (
				<CombatInfo label="Magical attack" small={false}>
					{magicalSkills.map(({ skill, value }, i) => (
						<React.Fragment key={i}>
							<ElementIco element={skill.element} minimal />
							{' '}
							{value}{i < magicalSkills.length - 1 ? ' + ' : ''}
						</React.Fragment>
					))}
				</CombatInfo>
			)}

			{isBackAttack && (
				<CombatInfo label="Back attack modifier">
					x{backAttackModifier}
				</CombatInfo>
			)}

			{affinities.length > 0 && (
				<CombatInfo label="Elemental affinity" small={false}>
					{affinities.map(({ element, affinity }, i) => (
						<React.Fragment key={i}>
							<ElementIco element={element} minimal />
							{' '}
							{'ELEMENTAL_WEAK' === affinity ? 'WEAK' : 'STRONG'}
							{i < affinities.length - 1 ? ' + ' : ''}
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
