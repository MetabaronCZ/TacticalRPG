import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const illusion: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.ILLUSION_INVISIBILITY, {
		title: 'Invisibility',
		type: SKillType.ACTIVE,
		range: SKillRange.R0,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}]
];

export const illusionSkills = illusion.map(([id, skill]) => id);
export default illusion;
