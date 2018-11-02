import { ISkillData } from 'modules/skill/skill-data';
import { Wield1HWeaponSkillID } from 'modules/skill/weapon';

const wield1HSkills: { [id in Wield1HWeaponSkillID]: ISkillData; } = {
	SWORD_1H_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	SWORD_1H_BLEED: {
		title: 'Bleed',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 0.5,
		status: ['BLEED'],
		cooldown: 1
	},
	AXE_1H_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	AXE_1H_SMASH: {
		title: 'Smash',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1.5,
		cooldown: 1
	},
	HAMMER_1H_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	HAMMER_1H_STUN: {
		title: 'Stun',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 0.5,
		status: ['STUN'],
		cooldown: 1
	}
};

export default wield1HSkills;
