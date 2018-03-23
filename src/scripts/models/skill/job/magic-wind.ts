import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const windMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.WIND_MAGIC_AIR_BLAST, {
		title: 'Air Blast',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.WIND_MAGIC_JET_STREAM, {
		title: 'Jet Stream',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.WIND_MAGIC_TORNADO, {
		title: 'Tornado',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.AOE3x3,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.WIND_MAGIC_FLOAT, {
		title: 'Float',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.WIND_MAGIC_WIND_AURA, {
		title: 'Wind Aura',
		type: SKillType.PASSIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		usage: SkillUsage.SPECIAL
	}]
];

export const windMagicSkillset: ISkillset = {
	title: 'Wind Magic',
	description: '',
	skills: windMagic.map(([id, skill]) => id)
};

export default windMagic;
