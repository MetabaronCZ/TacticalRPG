import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const waterMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.WATER_MAGIC_SPLASH, {
		title: 'Splash',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.WATER_MAGIC_SILENCE, {
		title: 'Silence',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.WATER_MAGIC_FLOOD, {
		title: 'Flood',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.AOE3x3,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.WATER_MAGIC_WATER_AURA, {
		title: 'Water Aura',
		type: SKillType.PASSIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		usage: SkillUsage.SPECIAL
	}]
];

export const waterMagicSkillset: ISkillset = {
	title: 'Water Magic',
	description: '',
	skills: waterMagic.map(([id, skill]) => id)
};

export default waterMagic;
