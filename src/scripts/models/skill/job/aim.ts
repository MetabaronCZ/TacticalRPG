import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { ISkill, SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill';

const aim: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.AIM_NONE, {
		title: 'Aim',
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
	}],
];

export const aimSkillset: ISkillset = {
	title: 'Aim',
	description: '',
	skills: aim.map(([id, skill]) => id)
};

export default aim;
