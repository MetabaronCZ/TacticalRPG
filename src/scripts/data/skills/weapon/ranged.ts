import { ISkillData } from 'engine/skill/skill-data';
import { RangedWeaponSkillID } from 'engine/skill/weapon';

const rangedSkills: { [id in RangedWeaponSkillID]: ISkillData; } = {
	BOW_ATTACK: {
		title: 'Attack',
		cost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	BOW_CHARGE: {
		title: 'Charge',
		cost: 4,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1.5
	},
	GUN_1H_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		isFixedPhysicalDamage: true,
		physicalDamage: 100
	},
	GUN_1H_CRIPPLE: {
		title: 'Cripple',
		cost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		isFixedPhysicalDamage: true,
		physicalDamage: 50,
		status: ['CRIPPLE']
	},
	GUN_2H_ATTACK: {
		title: 'Attack',
		cost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		isFixedPhysicalDamage: true,
		physicalDamage: 200
	},
	GUN_2H_PIERCE: {
		title: 'Pierce',
		cost: 4,
		type: 'ACTIVE',
		range: 1,
		area: 'LINE',
		target: 'ENEMY',
		isFixedPhysicalDamage: true,
		physicalDamage: 100
	}
};

export default rangedSkills;