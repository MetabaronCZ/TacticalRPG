import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const iceMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.ICE_MAGIC_ICE_SPEAR, {
		title: 'Ice Spear',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.ICE_MAGIC_FREEZE, {
		title: 'Freeze',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.ICE_MAGIC_BLIZZARD, {
		title: 'BLizzard',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.AOE3x3,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.ICE_MAGIC_FROST_AURA, {
		title: 'Frost Aura',
		type: SKillType.PASSIVE,
		range: SKillRange.R1,
		area: SKillArea.AOE3x3,
		usage: SkillUsage.SPECIAL
	}]
];

export const iceMagicSkillset: ISkillset = {
	title: 'Ice Magic',
	description: '',
	skills: iceMagic.map(([id, skill]) => id)
};

export default iceMagic;
