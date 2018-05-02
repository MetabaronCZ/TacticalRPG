import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { ISkill, SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill';

const combat: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.COMBAT_NONE, {
		title: 'Combat',
		cost: 0,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.NONE,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}]
];

export const combatSkillset: ISkillset = {
	title: 'Combat',
	description: '',
	skills: combat.map(([id, skill]) => id)
};

export default combat;
