import { ISkillData } from 'modules/skill/skill-data';
import { DarkMagicSkillID } from 'modules/skill/magic';

const darkMagic: { [id in DarkMagicSkillID]: ISkillData; } = {
	DRK_SHADOWBOLT: {
		title: 'Shadowbolt',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'DARK',
		physical: 0,
		magical: 1
	},
	DRK_BERSERK: {
		title: 'Berserk',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ANY',
		element: 'DARK',
		physical: 0,
		magical: 0,
		status: ['BERSERK'],
		cooldown: 1
	},
	DRK_SHADOWFLARE: {
		title: 'Shadowflare',
		mpCost: 20,
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'DARK',
		physical: 0,
		magical: 0.5,
		status: [],
		cooldown: 2
	},
	DRK_DARK_AURA: {
		title: 'Dark Aura',
		mpCost: 0,
		type: 'PASSIVE',
		grade: 1,
		range: 0,
		area: 'AOE3x3',
		target: 'SELF',
		element: 'DARK',
		physical: 0,
		magical: 0.25
	}
};

export default darkMagic;
