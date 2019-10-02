import { ISkillData } from 'modules/skill/skill-data';
import { HolyMagicSkillID } from 'modules/skill/magic';

const holyMagic: { [id in HolyMagicSkillID]: ISkillData; } = {
	HOL_HEAL: {
		title: 'Heal',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		element: 'HOLY',
		physical: 0,
		magical: 1,
		animation: {
			duration: 1000
		}
	},
	HOL_REMEDY: {
		title: 'Remedy',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		element: 'HOLY',
		physical: 0,
		magical: 0,
		animation: {
			duration: 1000
		}
	},
	HOL_REGENERATE: {
		title: 'Regenerate',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		element: 'HOLY',
		physical: 0,
		magical: 0.5,
		cooldown: 1,
		status: ['REGEN'],
		animation: {
			duration: 1000
		}
	},
	HOL_GROUP_HEAL: {
		title: 'Group Heal',
		mpCost: 20,
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ALLY',
		element: 'HOLY',
		physical: 0,
		magical: 0.5,
		cooldown: 2,
		animation: {
			duration: 1000
		}
	},
	HOL_REVIVE: {
		title: 'Revive',
		mpCost: 20,
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		element: 'HOLY',
		physical: 0,
		magical: 0,
		cooldown: 'ULTIMATE',
		animation: {
			duration: 1000
		}
	}
};

export default holyMagic;
