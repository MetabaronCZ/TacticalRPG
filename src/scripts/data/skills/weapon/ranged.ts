import { ISkillData } from 'modules/skill/skill-data';
import { RangedWeaponSkillID } from 'modules/skill/weapon';

const rangedSkills: { [id in RangedWeaponSkillID]: ISkillData; } = {
	BOW_ATTACK: {
		title: 'Attack',
		cost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 1,
		magical: 0,
	},
	BOW_CHARGE: {
		title: 'Charge',
		cost: 4,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 1.5,
		magical: 0,
		cooldown: 1
	},
	GUN_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		hitScan: true,
		isFixedDamage: true,
		physical: 30,
		magical: 0,
	},
	GUN_CRIPPLE: {
		title: 'Cripple',
		cost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		hitScan: true,
		isFixedDamage: true,
		status: ['CRIPPLE'],
		physical: 20,
		magical: 0,
		cooldown: 1
	}
};

export default rangedSkills;
