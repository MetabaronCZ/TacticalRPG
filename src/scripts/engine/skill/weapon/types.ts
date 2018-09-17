import { ISkillData } from 'engine/skill';

type SmallWeaponSkillID =
	'FISTS_ATTACK' | 'FISTS_DISARM' |
	'DAGGER_ATTACK' | 'DAGGER_STAB';
type MagicalWeaponSkillID =
	'MACE_ATTACK' | 'STAFF_ATTACK';
type RangedWeaponSkillID =
	'BOW_ATTACK' | 'BOW_CHARGE' |
	'GUN_1H_ATTACK' | 'GUN_1H_CRIPPLE' |
	'GUN_2H_ATTACK' | 'GUN_2H_PIERCE';
type ShieldWeaponSkillID =
	'SHIELD_SMALL_BLOCK' | 'SHIELD_LARGE_BLOCK';
type Wield1HWeaponSkillID =
	'SWORD_1H_ATTACK' | 'SWORD_1H_BLEED' |
	'AXE_1H_ATTACK' | 'AXE_1H_SMASH' |
	'HAMMER_1H_ATTACK' | 'HAMMER_1H_STUN';
type Wield2HWeaponSkillID =
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

type WeaponSkillList<T extends WeaponSkillID> = {
	[id in T]: ISkillData;
};

export type ISmallWeaponSkillList = WeaponSkillList<SmallWeaponSkillID>;
export type IMagicalWeaponSkillList = WeaponSkillList<MagicalWeaponSkillID>;
export type IRangedWeaponSkillList = WeaponSkillList<RangedWeaponSkillID>;
export type IShieldWeaponSkillList = WeaponSkillList<ShieldWeaponSkillID>;
export type IWield1HWeaponSkillList = WeaponSkillList<Wield1HWeaponSkillID>;
export type IWield2HWeaponSkillList = WeaponSkillList<Wield2HWeaponSkillID>;

export const attackSkills = [
	'FISTS_ATTACK', 'DAGGER_ATTACK',
	'SWORD_1H_ATTACK', 'AXE_1H_ATTACK', 'HAMMER_1H_ATTACK',
	'SPEAR_ATTACK',	'SWORD_2H_ATTACK', 'AXE_2H_ATTACK', 'HAMMER_2H_ATTACK',
	'MACE_ATTACK', 'STAFF_ATTACK',
	'BOW_ATTACK', 'GUN_1H_ATTACK', 'GUN_2H_ATTACK'
];
