import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const berserking: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.BERSERKING_NONE, {
		title: 'Berserking',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const berserkingSkills = berserking.map(([id, skill]) => id);
export default berserking;
