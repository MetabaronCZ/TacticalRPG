import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const windMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.WIND_MAGIC_NONE, {
		title: 'Wind Magic',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const windMagicSkills = windMagic.map(([id, skill]) => id);
export default windMagic;
