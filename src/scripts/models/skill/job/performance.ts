import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const performance: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.PERFORMANCE_NONE, {
		title: 'Performance',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const performanceSkillset: ISkillset = {
	title: 'Performance',
	description: '',
	skills: performance.map(([id, skill]) => id)
};

export default performance;
