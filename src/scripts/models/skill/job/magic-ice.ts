import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement, SkillStatus } from 'models/skill';

const iceMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.ICE_MAGIC_ICE_SPEAR, {
		title: 'Ice Spear',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.ICE,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}],
	[JobSKillID.ICE_MAGIC_FREEZE, {
		title: 'Freeze',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.ICE,
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: [SkillStatus.FREEZE]
	}],
	[JobSKillID.ICE_MAGIC_BLIZZARD, {
		title: 'Blizzard',
		cost: 4,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.ICE,
		physicalDamage: 0.25,
		elementalDamage: 0.5,
		status: []
	}],
	[JobSKillID.ICE_MAGIC_FROST_AURA, {
		title: 'Frost Aura',
		cost: 0,
		type: SKillType.PASSIVE,
		range: SKillRange.R1,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.ICE,
		physicalDamage: 0,
		elementalDamage: 0.25,
		status: [SkillStatus.FREEZE]
	}]
];

export const iceMagicSkillset: ISkillset = {
	title: 'Ice Magic',
	description: '',
	skills: iceMagic.map(([id, skill]) => id)
};

export default iceMagic;
