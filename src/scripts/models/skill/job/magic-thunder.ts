import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const thunderMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.THUNDER_MAGIC_NONE, {
		title: 'Thunder Magic',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const thunderMagicSkills = thunderMagic.map(([id, skill]) => id);
export default thunderMagic;
