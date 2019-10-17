import { ISkillData } from 'modules/skill/skill-data';
import { Wield1HWeaponSkillID } from 'modules/skill/weapon';

const wield1HSkills: { [id in Wield1HWeaponSkillID]: ISkillData; } = {
	S1H_ATTACK: {
		title: 'Attack',
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		cost: {
			AP: 1
		},
		physical: {
			modifier: 1,
			weapon: 'SWORD_1H'
		},
		animation: {
			duration: 1000
		}
	},
	S1H_BLEED: {
		title: 'Bleed',
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		cooldown: 1,
		status: ['BLEED'],
		cost: {
			AP: 2
		},
		physical: {
			modifier: 0.5,
			weapon: 'SWORD_1H'
		},
		animation: {
			duration: 1000
		}
	},
	A1H_ATTACK: {
		title: 'Attack',
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		cost: {
			AP: 1
		},
		physical: {
			modifier: 1,
			weapon: 'AXE_1H'
		},
		animation: {
			duration: 1000
		}
	},
	A1H_SMASH: {
		title: 'Smash',
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		cooldown: 1,
		cost: {
			AP: 2
		},
		physical: {
			modifier: 1.5,
			weapon: 'AXE_1H'
		},
		animation: {
			duration: 1000
		}
	},
	M1H_ATTACK: {
		title: 'Attack',
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		cost: {
			AP: 1
		},
		physical: {
			modifier: 1,
			weapon: 'MACE_1H'
		},
		animation: {
			duration: 1000
		}
	},
	M1H_STUN: {
		title: 'Stun',
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		cooldown: 1,
		status: ['STUN'],
		cost: {
			AP: 2
		},
		physical: {
			modifier: 0.5,
			weapon: 'MACE_1H'
		},
		animation: {
			duration: 1000
		}
	}
};

export default wield1HSkills;
