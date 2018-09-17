import { IIceMagicSkillList } from 'engine/skill/magic/types';

const iceMagic: IIceMagicSkillList = {
	ICE_MAGIC_ICE_SPEAR: {
		title: 'Ice Spear',
		cost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'ICE',
		physicalDamage: 0.5,
		elementalDamage: 1
	},
	ICE_MAGIC_FREEZE: {
		title: 'Freeze',
		cost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'ICE',
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: ['FREEZE']
	},
	ICE_MAGIC_BLIZZARD: {
		title: 'Blizzard',
		cost: 4,
		type: 'ACTIVE',
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'ICE',
		physicalDamage: 0.25,
		elementalDamage: 0.5
	},
	ICE_MAGIC_FROST_AURA: {
		title: 'Frost Aura',
		cost: 0,
		type: 'PASSIVE',
		range: 1,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'ICE',
		elementalDamage: 0.25,
		status: ['FREEZE']
	}
};

export default iceMagic;
