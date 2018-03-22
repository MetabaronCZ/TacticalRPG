import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const fireMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.FIRE_MAGIC_FIREBALL, {
		title: 'Fireball',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.FIRE_MAGIC_BURN, {
		title: 'Burn',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.FIRE_MAGIC_FIRESTORM, {
		title: 'Firestorm',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.AOE3x3,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.FIRE_MAGIC_FIRE_AURA, {
		title: 'Fire Aura',
		type: SKillType.PASSIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		usage: SkillUsage.SPECIAL
	}]
];

export const fireMagicSkills = fireMagic.map(([id, skill]) => id);
export default fireMagic;
