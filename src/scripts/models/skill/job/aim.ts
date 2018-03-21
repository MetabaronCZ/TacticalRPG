import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const aim: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.AIM_NONE, {
		title: 'Aim',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const aimSkills = aim.map(([id, skill]) => id);
export default aim;
