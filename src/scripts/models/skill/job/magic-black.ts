import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const blackMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.BLACK_MAGIC_CONDEMN, {
		title: 'Condemn',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.BLACK_MAGIC_DARK_AURA, {
		title: 'Dark Aura',
		type: SKillType.PASSIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		usage: SkillUsage.SPECIAL
	}],
];

export const blackMagicSkills = blackMagic.map(([id, skill]) => id);
export default blackMagic;
