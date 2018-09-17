import { IMagicalWeaponSkillList } from 'engine/skill/weapon/types';

const magicalSkills: IMagicalWeaponSkillList = {
	MACE_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	STAFF_ATTACK: {
		title: 'Attack',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	}
};

export default magicalSkills;
