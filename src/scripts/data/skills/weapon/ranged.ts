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
		magical: 0
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
		cooldown: 1
	},
	GUN_ATTACK: {
		title: 'Attack',
		apCost: 1,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		weapon: 'GUN',
		hitScan: true,
		isFixedDamage: true,
		physical: 30,
		magical: 0
	},
	GUN_CRIPPLE: {
		title: 'Cripple',
		apCost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		weapon: 'GUN',
		hitScan: true,
		isFixedDamage: true,
		status: ['CRIPPLE'],
		physical: 20,
		magical: 0,
		cooldown: 1
	}
};

export default rangedSkills;
