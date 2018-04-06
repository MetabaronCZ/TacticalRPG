import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement, SkillStatus } from 'models/skill';

const windMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.WIND_MAGIC_AIR_BLAST, {
		title: 'Air Blast',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.WIND,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}],
	[JobSKillID.WIND_MAGIC_JET_STREAM, {
		title: 'Jet Stream',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.WIND,
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: [] // ??? replace enemy
	}],
	[JobSKillID.WIND_MAGIC_TORNADO, {
		title: 'Tornado',
		cost: 4,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.WIND,
		physicalDamage: 0.25,
		elementalDamage: 0.5,
		status: []
	}],
	[JobSKillID.WIND_MAGIC_FLOAT, {
		title: 'Float',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.WIND,
		physicalDamage: 0,
		elementalDamage: 0,
		status: [SkillStatus.FLOAT]
	}],
	[JobSKillID.WIND_MAGIC_WIND_AURA, {
		title: 'Wind Aura',
		cost: 0,
		type: SKillType.PASSIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.WIND,
		physicalDamage: 0,
		elementalDamage: 0.25,
		status: []
	}]
];

export const windMagicSkillset: ISkillset = {
	title: 'Wind Magic',
	description: '',
	skills: windMagic.map(([id, skill]) => id)
};

export default windMagic;
