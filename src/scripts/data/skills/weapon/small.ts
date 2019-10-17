import { ISkillData } from 'modules/skill/skill-data';
import { SmallWeaponSkillID } from 'modules/skill/weapon';

const smallSkills: { [id in SmallWeaponSkillID]: ISkillData; } = {
	FST_ATTACK: {
		title: 'Attack',
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		cost: {
			AP: 2
		},
		physical: {
			modifier: 1,
			weapon: 'FISTS'
		},
		animation: {
			duration: 1000
		}
	},
	FST_DISARM: {
		title: 'Disarm',
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		status: ['DISARM'],
		cooldown: 1,
		cost: {
			AP: 2
		},
		physical: {
			modifier: 0.5,
			weapon: 'FISTS'
		},
		animation: {
			duration: 1000
		}
	},
	DGR_ATTACK: {
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
			weapon: 'DAGGER'
		},
		animation: {
			duration: 1000
		}
	},
	DGR_STAB: {
		title: 'Stab',
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		cooldown: 1,
		cost: {
			AP: 2
		},
		physical: {
			modifier: 2,
			weapon: 'DAGGER'
		},
		animation: {
			duration: 1000
		}
	}
};

export default smallSkills;
