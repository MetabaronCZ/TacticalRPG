import { ISkillData } from 'modules/skill/skill-data';
import { IceMagicSkillID } from 'modules/skill/magic';

const iceMagic: { [id in IceMagicSkillID]: ISkillData; } = {
	ICE_ICE_SPEAR: {
		title: 'Ice Spear',
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		cost: {
			MP: 10
		},
		magical: {
			modifier: 1,
			element: 'ICE'
		},
		animation: {
			duration: 1000
		}
	},
	ICE_FREEZE: {
		title: 'Freeze',
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		status: ['FREEZE'],
		cooldown: 1,
		cost: {
			MP: 10
		},
		magical: {
			modifier: 0.5,
			element: 'ICE'
		},
		animation: {
			duration: 1000
		}
	},
	ICE_BLIZZARD: {
		title: 'Blizzard',
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		cooldown: 2,
		cost: {
			MP: 20
		},
		magical: {
			modifier: 0.5,
			element: 'ICE'
		},
		animation: {
			duration: 1000
		}
	}
};

export default iceMagic;
