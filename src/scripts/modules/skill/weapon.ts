export type SmallWeaponSkillID =
	'FISTS_ATTACK' | 'FISTS_DISARM' |
	'DAGGER_ATTACK' | 'DAGGER_STAB';

export type MagicalWeaponSkillID =
	'MACE_ATTACK' | 'STAFF_ATTACK';

export type RangedWeaponSkillID =
	'BOW_ATTACK' | 'BOW_CHARGE' |
	'GUN_1H_ATTACK' | 'GUN_1H_CRIPPLE' |
	'GUN_2H_ATTACK' | 'GUN_2H_PIERCE';

export type ShieldWeaponSkillID =
	'SHIELD_SMALL_BLOCK' | 'SHIELD_LARGE_BLOCK';

export type Wield1HWeaponSkillID =
	'SWORD_1H_ATTACK' | 'SWORD_1H_BLEED' |
	'AXE_1H_ATTACK' | 'AXE_1H_SMASH' |
	'HAMMER_1H_ATTACK' | 'HAMMER_1H_STUN';

export type Wield2HWeaponSkillID =
	'SPEAR_ATTACK' | 'SPEAR_THRUST' |
	'SWORD_2H_ATTACK' | 'SWORD_2H_CLEAVE' |
	'AXE_2H_ATTACK' | 'AXE_2H_WHIRLWIND' |
	'HAMMER_2H_ATTACK' | 'HAMMER_2H_SHOCKWAVE';

export type WeaponSkillID =
	SmallWeaponSkillID |
	Wield1HWeaponSkillID |
	Wield2HWeaponSkillID |
	MagicalWeaponSkillID |
	RangedWeaponSkillID |
	ShieldWeaponSkillID;
