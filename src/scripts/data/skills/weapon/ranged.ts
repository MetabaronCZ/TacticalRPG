import { ISkillData } from 'modules/skill/skill-data';
import { RangedWeaponSkillID } from 'modules/skill/weapon';

const rangedSkills: { [id in RangedWeaponSkillID]: ISkillData; } = {
	BOW_ATTACK: {
		title: 'Attack',
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		cost: {
			AP: 2
		},
		physical: {
			modifier: 1,
			weapon: 'BOW'
		},
		animation: {
			duration: 1000
		}
	},
	BOW_CHARGE: {
		title: 'Charge',
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		cooldown: 1,
		cost: {
			AP: 4
		},
		physical: {
			modifier: 1.5,
			weapon: 'BOW'
		},
		animation: {
			duration: 1000
		}
	},
	GUN_ATTACK: {
		title: 'Attack',
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		cost: {
			AP: 1
		},
		physical: {
			modifier: 30,
			weapon: 'GUN'
		},
		animation: {
			duration: 1000
		}
	},
	GUN_CRIPPLE: {
		title: 'Cripple',
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		cooldown: 1,
		status: ['CRIPPLE'],
		cost: {
			AP: 2
		},
		physical: {
			modifier: 20,
			weapon: 'GUN'
		},
		animation: {
			duration: 1000
		}
	}
};

export default rangedSkills;
