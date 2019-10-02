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
		magical: 1,
		animation: {
			duration: 1000
		}
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
		cooldown: 1,
		status: ['FREEZE'],
		animation: {
			duration: 1000
		}
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
		cooldown: 2,
		animation: {
			duration: 1000
		}
	}
};

export default iceMagic;
