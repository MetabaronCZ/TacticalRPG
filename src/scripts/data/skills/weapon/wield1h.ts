import { ISkillData } from 'modules/skill/skill-data';
import { Wield1HWeaponSkillID } from 'modules/skill/weapon';

const wield1HSkills: { [id in Wield1HWeaponSkillID]: ISkillData; } = {
	S1H_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 1,
		magical: 0,
	},
	S1H_BLEED: {
		title: 'Bleed',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 0.5,
		magical: 0,
		status: ['BLEED'],
		cooldown: 1
	},
	A1H_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 1,
		magical: 0,
	},
	A1H_SMASH: {
		title: 'Smash',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 1.5,
		magical: 0,
		cooldown: 1
	},
	H1H_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 1,
		magical: 0,
	},
	H1H_STUN: {
		title: 'Stun',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 0.5,
		magical: 0,
		status: ['STUN'],
		cooldown: 1
	}
};

export default wield1HSkills;
