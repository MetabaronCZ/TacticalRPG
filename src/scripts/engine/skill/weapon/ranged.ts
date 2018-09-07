import { IRangedWeaponSkillList } from 'engine/skill/weapon/types';
import { SkillRange } from 'engine/skill';

const rangedSkills: IRangedWeaponSkillList = {
	BOW_ATTACK: {
		title: 'Attack',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	BOW_CHARGE: {
		title: 'Charge',
		cost: 4,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1.5
	},
	GUN_1H_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'SINGLE',
		target: 'ENEMY',
		isFixedPhysicalDamage: true,
		physicalDamage: 100
	},
	GUN_1H_CRIPPLE: {
		title: 'Cripple',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R4,
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
		range: SkillRange.R4,
		area: 'SINGLE',
		target: 'ENEMY',
		isFixedPhysicalDamage: true,
		physicalDamage: 200
	},
	GUN_2H_PIERCE: {
		title: 'Pierce',
		cost: 4,
		type: 'ACTIVE',
		range: SkillRange.R1,
		area: 'LINE',
		target: 'ENEMY',
		isFixedPhysicalDamage: true,
		physicalDamage: 100
	}
};

export default rangedSkills;
