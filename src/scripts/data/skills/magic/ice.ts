import { ISkillData } from 'modules/skill/skill-data';
import { IceMagicSkillID } from 'modules/skill/magic';

const iceMagic: { [id in IceMagicSkillID]: ISkillData; } = {
	ICE_ICE_SPEAR: {
		title: 'Ice Spear',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'ICE',
		physical: 0,
		magical: 1
	},
	ICE_FREEZE: {
		title: 'Freeze',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'ICE',
		physical: 0,
		magical: 0.5,
		status: ['FREEZE'],
		cooldown: 1
	},
	ICE_BLIZZARD: {
		title: 'Blizzard',
		mpCost: 20,
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'ICE',
		physical: 0,
		magical: 0.5,
		cooldown: 2
	},
	ICE_FROST_AURA: {
		title: 'Frost Aura',
		mpCost: 0,
		type: 'PASSIVE',
		grade: 1,
		range: 1,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'ICE',
		physical: 0,
		magical: 0.25,
		status: ['FREEZE']
	}
};

export default iceMagic;
