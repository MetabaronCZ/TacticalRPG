import { ISkillData } from 'modules/skill/skill-data';
import { Wield1HWeaponSkillID } from 'modules/skill/weapon';

const wield1HSkills: { [id in Wield1HWeaponSkillID]: ISkillData; } = {
	S1H_ATTACK: {
		title: 'Attack',
		apCost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		weapon: 'SWORD_1H',
		physical: 1,
		magical: 0,
		animation: {
			duration: 1000
		}
	},
	S1H_BLEED: {
		title: 'Bleed',
		apCost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		weapon: 'SWORD_1H',
		physical: 0.5,
		magical: 0,
		cooldown: 1,
		status: ['BLEED'],
		animation: {
			duration: 1000
		}
	},
	A1H_ATTACK: {
		title: 'Attack',
		apCost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		weapon: 'AXE_1H',
		physical: 1,
		magical: 0,
		animation: {
			duration: 1000
		}
	},
	A1H_SMASH: {
		title: 'Smash',
		apCost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		weapon: 'AXE_1H',
		physical: 1.5,
		magical: 0,
		cooldown: 1,
		animation: {
			duration: 1000
		}
	},
	M1H_ATTACK: {
		title: 'Attack',
		apCost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		weapon: 'MACE_1H',
		physical: 1,
		magical: 0,
		animation: {
			duration: 1000
		}
	},
	M1H_STUN: {
		title: 'Stun',
		apCost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		weapon: 'MACE_1H',
		physical: 0.5,
		magical: 0,
		cooldown: 1,
		status: ['STUN'],
		animation: {
			duration: 1000
		}
	}
};

export default wield1HSkills;
