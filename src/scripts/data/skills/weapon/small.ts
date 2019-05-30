import { ISkillData } from 'modules/skill/skill-data';
import { SmallWeaponSkillID } from 'modules/skill/weapon';

const smallSkills: { [id in SmallWeaponSkillID]: ISkillData; } = {
	FST_ATTACK: {
		title: 'Attack',
		apCost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 1,
		magical: 0,
	},
	FST_DISARM: {
		title: 'Disarm',
		apCost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 0.5,
		magical: 0,
		status: ['DISARM'],
		cooldown: 1
	},
	DGR_ATTACK: {
		title: 'Attack',
		apCost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 1,
		magical: 0,
	},
	DGR_STAB: {
		title: 'Stab',
		apCost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 2,
		magical: 0,
		cooldown: 1
	}
};

export default smallSkills;
