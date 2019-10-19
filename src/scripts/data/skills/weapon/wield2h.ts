import { ISkillData } from 'modules/skill/skill-data';
import { Wield2HWeaponSkillID } from 'modules/skill/weapon';

const wield2HSkills: { [id in Wield2HWeaponSkillID]: ISkillData; } = {
	SPR_ATTACK: {
		title: 'Attack',
		type: 'ACTIVE',
		range: 2,
		area: 'LINE',
		target: 'ENEMY',
		cost: {
			AP: 2
		},
		physical: {
			modifier: 1,
			weapon: 'SPEAR'
		},
		animation: {
			duration: 1000
		}
	},
	SPR_THRUST: {
		title: 'Thrust',
		type: 'ACTIVE',
		range: 2,
		area: 'LINE',
		target: 'ENEMY',
		piercing: true,
		cooldown: 1,
		cost: {
			AP: 4
		},
		physical: {
			modifier: 1,
			weapon: 'SPEAR'
		},
		animation: {
			duration: 1000
		}
	},
	S2H_ATTACK: {
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
			weapon: 'SWORD_2H'
		},
		animation: {
			duration: 1000
		}
	},
	S2H_CLEAVE: {
		title: 'Cleave',
		type: 'ACTIVE',
		range: 1,
		area: 'NEIGHBOURS',
		target: 'ENEMY',
		cooldown: 1,
		cost: {
			AP: 4
		},
		physical: {
			modifier: 0.5,
			weapon: 'SWORD_2H'
		},
		animation: {
			duration: 1000
		}
	},
	A2H_ATTACK: {
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
			weapon: 'AXE_2H'
		},
		animation: {
			duration: 1000
		}
	},
	A2H_WHIRLWIND: {
		title: 'Whirlwind',
		type: 'ACTIVE',
		range: 1,
		area: 'NEIGHBOURS',
		target: 'ENEMY',
		cooldown: 1,
		cost: {
			AP: 4
		},
		physical: {
			modifier: 0.5,
			weapon: 'AXE_2H'
		},
		animation: {
			duration: 1000
		}
	},
	M2H_ATTACK: {
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
			weapon: 'MACE_2H'
		},
		animation: {
			duration: 1000
		}
	},
	M2H_SHOCKWAVE: {
		title: 'Shockwave',
		type: 'ACTIVE',
		range: 1,
		area: 'NEIGHBOURS',
		target: 'ENEMY',
		cooldown: 1,
		cost: {
			AP: 4
		},
		physical: {
			modifier: 0.5,
			weapon: 'MACE_2H'
		},
		animation: {
			duration: 1000
		}
	}
};

export default wield2HSkills;
