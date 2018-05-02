import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { ISkill, SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill';

const performance: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.PERFORMANCE_NONE, {
		title: 'Performance',
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

export const performanceSkillset: ISkillset = {
	title: 'Performance',
	description: '',
	skills: performance.map(([id, skill]) => id)
};

export default performance;
