import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement, SkillStatus } from 'models/skill';

const fireMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.FIRE_MAGIC_FIREBALL, {
		title: 'Fireball',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.FIRE,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}],
	[JobSKillID.FIRE_MAGIC_BURN, {
		title: 'Burn',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.FIRE,
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: [SkillStatus.BURN]
	}],
	[JobSKillID.FIRE_MAGIC_FIRESTORM, {
		title: 'Firestorm',
		cost: 4,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.FIRE,
		physicalDamage: 0.25,
		elementalDamage: 0.5,
		status: []
	}],
	[JobSKillID.FIRE_MAGIC_FIRE_AURA, {
		title: 'Fire Aura',
		cost: 0,
		type: SKillType.PASSIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		isAreaEffect: false,
		element: SKillElement.FIRE,
		physicalDamage: 0,
		elementalDamage: 0.25,
		status: [SkillStatus.BURN]
	}]
];

export const fireMagicSkillset: ISkillset = {
	title: 'Fire Magic',
	description: '',
	skills: fireMagic.map(([id, skill]) => id)
};

export default fireMagic;
