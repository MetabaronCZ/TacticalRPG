import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const illusion: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.ILLUSION_NONE, {
		title: 'Illusion',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const illusionSkills = illusion.map(([id, skill]) => id);
export default illusion;
