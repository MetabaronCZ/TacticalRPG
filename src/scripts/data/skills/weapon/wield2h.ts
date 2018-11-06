import { ISkillData } from 'modules/skill/skill-data';
import { Wield2HWeaponSkillID } from 'modules/skill/weapon';

const wield2HSkills: { [id in Wield2HWeaponSkillID]: ISkillData; } = {
	SPR_ATTACK: {
		title: 'Attack',
		cost: 2,
		type: 'ACTIVE',
		range: 2,
		area: 'LINE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	SPR_THRUST: {
		title: 'Thrust',
		cost: 4,
		type: 'ACTIVE',
		range: 2,
		area: 'LINE',
		target: 'ENEMY',
		physicalDamage: 1,
		cooldown: 1
	},
	S2H_ATTACK: {
		title: 'Attack',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	S2H_CLEAVE: {
		title: 'Cleave',
		cost: 4,
		type: 'ACTIVE',
		range: 1,
		area: 'NEIGHBOURS',
		target: 'ENEMY',
		physicalDamage: 0.5,
		cooldown: 1
	},
	A2H_ATTACK: {
		title: 'Attack',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	A2H_WHIRLWIND: {
		title: 'Whirlwind',
		cost: 4,
		type: 'ACTIVE',
		range: 1,
		area: 'NEIGHBOURS',
		target: 'ENEMY',
		physicalDamage: 0.5,
		cooldown: 1
	},
	H2H_ATTACK: {
		title: 'Attack',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	H2H_SHOCKWAVE: {
		title: 'Shockwave',
		cost: 4,
		type: 'ACTIVE',
		range: 1,
		area: 'CROSS',
		target: 'ENEMY',
		physicalDamage: 0.5,
		cooldown: 1
	}
};

export default wield2HSkills;
