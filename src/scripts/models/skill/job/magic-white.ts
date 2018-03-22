import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const whiteMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.WHITE_MAGIC_HEAL, {
		title: 'Heal',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.WHITE_MAGIC_REMEDY, {
		title: 'Remedy',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.WHITE_MAGIC_REGENERATE, {
		title: 'Regenerate',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.WHITE_MAGIC_GROUP_HEAL, {
		title: 'Group Heal',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.AOE3x3,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.WHITE_MAGIC_HOLY_AURA, {
		title: 'Holy Aura',
		type: SKillType.PASSIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.WHITE_MAGIC_REVIVE, {
		title: 'Revive',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ULTIMATE
	}]
];

export const whiteMagicSkills = whiteMagic.map(([id, skill]) => id);
export default whiteMagic;
