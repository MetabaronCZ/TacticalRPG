import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const performance: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.PERFORMANCE_NONE, {
		title: 'Performance',
		cost: 0,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}],
];

export const performanceSkillset: ISkillset = {
	title: 'Performance',
	description: '',
	skills: performance.map(([id, skill]) => id)
};

export default performance;
