import { ISkillData } from 'modules/skill/skill-data';
import { DarkMagicSkillID } from 'modules/skill/magic';

const darkMagic: { [id in DarkMagicSkillID]: ISkillData; } = {
	DRK_SHADOWBOLT: {
		title: 'Shadowbolt',
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
			element: 'DARK'
		},
		animation: {
			duration: 1000
		}
	},
	DRK_BERSERK: {
		title: 'Berserk',
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ANY',
		status: ['BERSERK'],
		cooldown: 1,
		cost: {
			MP: 10
		},
		magical: {
			modifier: 0,
			element: 'DARK'
		},
		animation: {
			duration: 1000
		}
	},
	DRK_SHADOWFLARE: {
		title: 'Shadowflare',
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		status: [],
		cooldown: 2,
		cost: {
			MP: 20
		},
		magical: {
			modifier: 0.5,
			element: 'DARK'
		},
		animation: {
			duration: 1000
		}
	}
};

export default darkMagic;
