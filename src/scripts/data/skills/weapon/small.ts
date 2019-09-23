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
		weapon: 'FISTS',
		physical: 1,
		magical: 0,
		animation: {
			duration: 1000
		}
	},
	FST_DISARM: {
		title: 'Disarm',
		apCost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		weapon: 'FISTS',
		physical: 0.5,
		magical: 0,
		status: ['DISARM'],
		cooldown: 1,
		animation: {
			duration: 1000
		}
	},
	DGR_ATTACK: {
		title: 'Attack',
		apCost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		weapon: 'DAGGER',
		physical: 1,
		magical: 0,
		animation: {
			duration: 1000
		}
	},
	DGR_STAB: {
		title: 'Stab',
		apCost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		weapon: 'DAGGER',
		physical: 2,
		magical: 0,
		cooldown: 1,
		animation: {
			duration: 1000
		}
	}
};

export default smallSkills;
