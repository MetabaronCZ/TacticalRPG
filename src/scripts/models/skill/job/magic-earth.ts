import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const earthMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.EARTH_MAGIC_NONE, {
		title: 'Earth Magic',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const earthMagicSkills = earthMagic.map(([id, skill]) => id);
export default earthMagic;
