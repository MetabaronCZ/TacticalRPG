import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const waterMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.WATER_MAGIC_NONE, {
		title: 'Water Magic',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const waterMagicSkills = waterMagic.map(([id, skill]) => id);
export default waterMagic;
