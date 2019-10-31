export type SmallWeaponSkillID =
	'FST_ATTACK' | 'FST_DISARM' |
	'DGR_ATTACK' | 'DGR_STAB';

export type RangedWeaponSkillID =
	'BOW_ATTACK' | 'BOW_CHARGE' |
	'GUN_ATTACK' | 'GUN_CRIPPLE';

export type MagicalWeaponSkillID =
	'ATB_ATTACK';

export type ShieldWeaponSkillID =
	'SHD_SMALL_BLOCK' | 'SHD_LARGE_BLOCK';

export type Wield1HWeaponSkillID =
	'S1H_ATTACK' | 'S1H_BLEED' |
	'A1H_ATTACK' | 'A1H_SMASH' |
	'M1H_ATTACK' | 'M1H_STUN';

export type Wield2HWeaponSkillID =
	'SPR_ATTACK' | 'SPR_THRUST' |
	'S2H_ATTACK' | 'S2H_CLEAVE' |
	'A2H_ATTACK' | 'A2H_WHIRLWIND' |
	'M2H_ATTACK' | 'M2H_SHOCKWAVE';

export type WeaponSkillID =
	SmallWeaponSkillID |
	Wield1HWeaponSkillID |
	Wield2HWeaponSkillID |
	MagicalWeaponSkillID |
	RangedWeaponSkillID |
	ShieldWeaponSkillID;
