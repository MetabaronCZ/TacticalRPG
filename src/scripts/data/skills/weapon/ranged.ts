import { ISkillData } from 'modules/skill/skill-data';
import { RangedWeaponSkillID } from 'modules/skill/weapon';

const rangedSkills: { [id in RangedWeaponSkillID]: ISkillData; } = {
	BOW_ATTACK: {
		title: 'Attack',
		apCost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		weapon: 'BOW',
		physical: 1,
		magical: 0,
		animation: {
			duration: 1000
		}
	},
	BOW_CHARGE: {
		title: 'Charge',
		apCost: 4,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		weapon: 'BOW',
		physical: 1.5,
		magical: 0,
		cooldown: 1,
		animation: {
			duration: 1000
		}
	},
	GUN_ATTACK: {
		title: 'Attack',
		apCost: 1,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		weapon: 'GUN',
		physical: 30,
		magical: 0,
		animation: {
			duration: 1000
		}
	},
	GUN_CRIPPLE: {
		title: 'Cripple',
		apCost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		weapon: 'GUN',
		physical: 20,
		magical: 0,
		cooldown: 1,
		status: ['CRIPPLE'],
		animation: {
			duration: 1000
		}
	}
};

export default rangedSkills;
