import { ISkillData } from 'modules/skill/skill-data';
import { Wield2HWeaponSkillID } from 'modules/skill/weapon';

const wield2HSkills: { [id in Wield2HWeaponSkillID]: ISkillData; } = {
	SPEAR_ATTACK: {
		title: 'Attack',
		cost: 2,
		type: 'ACTIVE',
		range: 2,
		area: 'LINE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	SPEAR_THRUST: {
		title: 'Thrust',
		cost: 4,
		type: 'ACTIVE',
		range: 2,
		area: 'LINE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	SWORD_2H_ATTACK: {
		title: 'Attack',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	SWORD_2H_CLEAVE: {
		title: 'Cleave',
		cost: 4,
		type: 'ACTIVE',
		range: 1,
		area: 'NEIGHBOURS',
		target: 'ENEMY',
		physicalDamage: 0.5
	},
	AXE_2H_ATTACK: {
		title: 'Attack',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	AXE_2H_WHIRLWIND: {
		title: 'Whirlwind',
		cost: 4,
		type: 'ACTIVE',
		range: 1,
		area: 'NEIGHBOURS',
		target: 'ENEMY',
		physicalDamage: 0.5
	},
	HAMMER_2H_ATTACK: {
		title: 'Attack',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	HAMMER_2H_SHOCKWAVE: {
		title: 'Shockwave',
		cost: 4,
		type: 'ACTIVE',
		range: 1,
		area: 'CROSS',
		target: 'ENEMY',
		physicalDamage: 0.5
	}
};

export default wield2HSkills;
