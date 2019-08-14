import { ISkillData } from 'modules/skill/skill-data';
import { Wield2HWeaponSkillID } from 'modules/skill/weapon';

const wield2HSkills: { [id in Wield2HWeaponSkillID]: ISkillData; } = {
	SPR_ATTACK: {
		title: 'Attack',
		apCost: 2,
		type: 'ACTIVE',
		range: 2,
		area: 'LINE',
		target: 'ENEMY',
		hitScan: true,
		physical: 1,
		magical: 0
	},
	SPR_THRUST: {
		title: 'Thrust',
		apCost: 4,
		type: 'ACTIVE',
		range: 2,
		area: 'LINE',
		target: 'ENEMY',
		hitScan: true,
		cooldown: 1,
		physical: 1,
		magical: 0
	},
	S2H_ATTACK: {
		title: 'Attack',
		apCost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 1,
		magical: 0
	},
	S2H_CLEAVE: {
		title: 'Cleave',
		apCost: 4,
		type: 'ACTIVE',
		range: 1,
		area: 'NEIGHBOURS',
		target: 'ENEMY',
		physical: 0.5,
		magical: 0,
		cooldown: 1
	},
	A2H_ATTACK: {
		title: 'Attack',
		apCost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 1,
		magical: 0
	},
	A2H_WHIRLWIND: {
		title: 'Whirlwind',
		apCost: 4,
		type: 'ACTIVE',
		range: 1,
		area: 'NEIGHBOURS',
		target: 'ENEMY',
		physical: 0.5,
		magical: 0,
		cooldown: 1
	},
	M2H_ATTACK: {
		title: 'Attack',
		apCost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 1,
		magical: 0
	},
	M2H_SHOCKWAVE: {
		title: 'Shockwave',
		apCost: 4,
		type: 'ACTIVE',
		range: 1,
		area: 'NEIGHBOURS',
		target: 'ENEMY',
		physical: 0.5,
		magical: 0,
		cooldown: 1
	}
};

export default wield2HSkills;
