import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement, SkillStatus } from 'models/skill';

const whiteMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.WHITE_MAGIC_HEAL, {
		title: 'Heal',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 1,
		status: []
	}],
	[JobSKillID.WHITE_MAGIC_REMEDY, {
		title: 'Remedy',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}],
	[JobSKillID.WHITE_MAGIC_REGENERATE, {
		title: 'Regenerate',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 0.5,
		status: [SkillStatus.REGEN]
	}],
	[JobSKillID.WHITE_MAGIC_GROUP_HEAL, {
		title: 'Group Heal',
		cost: 4,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 0.5,
		status: []
	}],
	[JobSKillID.WHITE_MAGIC_HOLY_AURA, {
		title: 'Holy Aura',
		cost: 0,
		type: SKillType.PASSIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 0.25,
		status: []
	}],
	[JobSKillID.WHITE_MAGIC_REVIVE, {
		title: 'Revive',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}]
];

export const whiteMagicSkillset: ISkillset = {
	title: 'White Magic',
	description: '',
	skills: whiteMagic.map(([id, skill]) => id)
};

export default whiteMagic;
