import { ISkillData } from 'modules/skill/skill-data';
import { SmallWeaponSkillID } from 'modules/skill/weapon';

const smallSkills: { [id in SmallWeaponSkillID]: ISkillData; } = {
	FST_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	FST_DISARM: {
		title: 'Disarm',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 0.5,
		status: ['DISARM'],
		cooldown: 1
	},
	DGR_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	DGR_STAB: {
		title: 'Stab',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 2,
		cooldown: 1
	}
};

export default smallSkills;
