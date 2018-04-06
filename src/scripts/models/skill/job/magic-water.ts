import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement, SkillStatus } from 'models/skill';

const waterMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.WATER_MAGIC_SPLASH, {
		title: 'Splash',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.WATER,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}],
	[JobSKillID.WATER_MAGIC_SILENCE, {
		title: 'Silence',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.WATER,
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: [SkillStatus.SILENCE]
	}],
	[JobSKillID.WATER_MAGIC_FLOOD, {
		title: 'Flood',
		cost: 4,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.WATER,
		physicalDamage: 0.25,
		elementalDamage: 0.5,
		status: []
	}],
	[JobSKillID.WATER_MAGIC_WATER_AURA, {
		title: 'Water Aura',
		cost: 0,
		type: SKillType.PASSIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.WATER,
		physicalDamage: 0,
		elementalDamage: 0.25,
		status: [SkillStatus.SILENCE]
	}]
];

export const waterMagicSkillset: ISkillset = {
	title: 'Water Magic',
	description: '',
	skills: waterMagic.map(([id, skill]) => id)
};

export default waterMagic;
