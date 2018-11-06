import { ISkillData } from 'modules/skill/skill-data';
import { IceMagicSkillID } from 'modules/skill/magic';

const iceMagic: { [id in IceMagicSkillID]: ISkillData; } = {
	ICE_ICE_SPEAR: {
		title: 'Ice Spear',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'ICE',
		physicalDamage: 0.5,
		elementalDamage: 1
	},
	ICE_FREEZE: {
		title: 'Freeze',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'ICE',
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: ['FREEZE'],
		cooldown: 1
	},
	ICE_BLIZZARD: {
		title: 'Blizzard',
		cost: 4,
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'ICE',
		physicalDamage: 0.25,
		elementalDamage: 0.5,
		cooldown: 2
	},
	ICE_FROST_AURA: {
		title: 'Frost Aura',
		cost: 0,
		type: 'PASSIVE',
		grade: 1,
		range: 1,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'ICE',
		elementalDamage: 0.25,
		status: ['FREEZE']
	}
};

export default iceMagic;
