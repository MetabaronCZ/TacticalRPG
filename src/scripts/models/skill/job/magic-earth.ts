import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const earthMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.EARTH_MAGIC_BOULDER, {
		title: 'Boulder',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.EARTH_MAGIC_EARTH_SPIKE, {
		title: 'Earth Spike',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.EARTH_MAGIC_EARTHQUAKE, {
		title: 'Earthquake',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.AOE3x3,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.EARTH_MAGIC_STONE_SKIN, {
		title: 'Stone Skin',
		type: SKillType.PASSIVE,
		range: SKillRange.R0,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}]
];

export const earthMagicSkills = earthMagic.map(([id, skill]) => id);
export default earthMagic;
