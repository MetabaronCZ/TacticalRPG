import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const whiteMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.WHITE_MAGIC_NONE, {
		title: 'White Magic',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const whiteMagicSkills = whiteMagic.map(([id, skill]) => id);
export default whiteMagic;
