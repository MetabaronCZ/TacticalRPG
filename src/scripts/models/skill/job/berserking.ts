import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const berserking: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.BERSERKING_BERSERK, {
		title: 'Berserk',
		type: SKillType.ACTIVE,
		range: SKillRange.R0,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ULTIMATE
	}],
];

export const berserkingSkills = berserking.map(([id, skill]) => id);
export default berserking;
