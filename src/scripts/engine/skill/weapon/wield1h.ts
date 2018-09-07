import { IWield1HWeaponSkillList } from 'engine/skill/weapon/types';
import { SkillRange } from 'engine/skill';

const wield1HSkills: IWield1HWeaponSkillList = {
	SWORD_1H_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: SkillRange.R1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	SWORD_1H_BLEED: {
		title: 'Bleed',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 0.5,
		status: ['BLEED']
	},
	AXE_1H_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: SkillRange.R1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	AXE_1H_SMASH: {
		title: 'Smash',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1.5
	},
	HAMMER_1H_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: SkillRange.R1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	HAMMER_1H_STUN: {
		title: 'Stun',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 0.5,
		status: ['STUN']
	}
};

export default wield1HSkills;
