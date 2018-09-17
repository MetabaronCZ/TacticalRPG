import { ISmallWeaponSkillList } from 'engine/skill/weapon/types';

const smallSkills: ISmallWeaponSkillList = {
	FISTS_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	FISTS_DISARM: {
		title: 'Disarm',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 0.5,
		status: ['DISARM']
	},
	DAGGER_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	DAGGER_STAB: {
		title: 'Stab',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 2
	}
};

export default smallSkills;
