import React from 'react';

import { StatusEffectID } from 'modules/battle/status-effect';
import { formatCost, ICommandSnapshot } from 'modules/battle/command';
import { ICasterCombatPreview, ICasterPreviewItem } from 'modules/battle/combat';

import Ico from 'ui/common/Ico';
import WeaponIco from 'ui/common/WeaponIco';
import ElementIco from 'ui/common/ElementIco';
import CombatInfo from 'ui/battle/CombatInfo';
import CommandTitle from 'ui/battle/CommandTitle';

interface IProps {
	readonly preview: ICasterCombatPreview | null;
	readonly command: ICommandSnapshot;
}

const CommandInfo: React.SFC<IProps> = ({ preview, command }) => {
	const { cost } = command;

	let physicalSkills: ICasterPreviewItem[] = [];
	let magicalSkills: ICasterPreviewItem[] = [];
	let healingSkills: ICasterPreviewItem[] = [];
	let status: StatusEffectID[] = [];
	let directionMod = 1;
	let affinityMod = 1;
	let statusMod = 1;

	if (preview) {
		physicalSkills = preview.physicalSkills;
		magicalSkills = preview.magicalSkills;
		healingSkills = preview.healingSkills;

		directionMod = preview.directionModifier;
		statusMod = preview.statusModifier;
		affinityMod = preview.affinity;

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
					{healingSkills.map((skill, i) => (
						<React.Fragment key={i}>
							<Ico name="healing" />
							{skill.value}{i < healingSkills.length - 1 ? ' + ' : ''}
						</React.Fragment>
					))}
				</CombatInfo>
			)}
	
			{physicalSkills.length > 0 && (
				<CombatInfo label="Physical attack" small={false}>
					{physicalSkills.map(({ weapon, value }, i) => (
						<React.Fragment key={i}>
							<WeaponIco weapon={weapon} minimal />
							{' '}
							{value}{i < physicalSkills.length - 1 ? ' + ' : ''}
						</React.Fragment>
					))}
				</CombatInfo>
			)}

			{magicalSkills.length > 0 && (
				<CombatInfo label="Magical attack" small={false}>
					{magicalSkills.map(({ element, value }, i) => (
						<React.Fragment key={i}>
							<ElementIco element={element} minimal />
							{' '}
							{value}{i < magicalSkills.length - 1 ? ' + ' : ''}
						</React.Fragment>
					))}
				</CombatInfo>
			)}

			{(1 !== directionMod) && (
				<CombatInfo label="Back attack modifier">
					x{directionMod}
				</CombatInfo>
			)}

			{(1 !== affinityMod) && (
				<CombatInfo label="Elemental modifier">
					x{affinityMod}
				</CombatInfo>
			)}

			{(1 !== statusMod) && (
				<CombatInfo label="Status modifier">
					x{statusMod}
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
