import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const blackMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.BLACK_MAGIC_NONE, {
		title: 'Black Magic',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const blackMagicSkills = blackMagic.map(([id, skill]) => id);
export default blackMagic;
