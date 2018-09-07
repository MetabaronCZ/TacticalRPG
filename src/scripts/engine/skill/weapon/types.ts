import { ISkillData } from 'engine/skill';

type IPartialWeaponSkillList<T extends WeaponSkillID> = {
	[id in T]: ISkillData;
};

export type WeaponSkillID =
	'FISTS_ATTACK' | 'FISTS_DISARM' |
	'DAGGER_ATTACK' | 'DAGGER_STAB' |
	'SWORD_1H_ATTACK' | 'SWORD_1H_BLEED' |
	'AXE_1H_ATTACK' | 'AXE_1H_SMASH' |
	'HAMMER_1H_ATTACK' | 'HAMMER_1H_STUN' |
	'SPEAR_ATTACK' | 'SPEAR_THRUST' |
	'SWORD_2H_ATTACK' | 'SWORD_2H_CLEAVE' |
	'AXE_2H_ATTACK' | 'AXE_2H_WHIRLWIND' |
	'HAMMER_2H_ATTACK' | 'HAMMER_2H_SHOCKWAVE' |
	'MACE_ATTACK' |
	'STAFF_ATTACK' |
	'BOW_ATTACK' | 'BOW_CHARGE' |
	'GUN_1H_ATTACK' | 'GUN_1H_CRIPPLE' |
	'GUN_2H_ATTACK' | 'GUN_2H_PIERCE' |
	'SHIELD_SMALL_BLOCK' |
	'SHIELD_LARGE_BLOCK';

export type ISmallWeaponSkillList = IPartialWeaponSkillList<
	'FISTS_ATTACK' | 'FISTS_DISARM' |
	'DAGGER_ATTACK' | 'DAGGER_STAB'
>;

export type IMagicalWeaponSkillList = IPartialWeaponSkillList<
	'MACE_ATTACK' |
	'STAFF_ATTACK'
>;

export type IRangedWeaponSkillList = IPartialWeaponSkillList<
	'BOW_ATTACK' | 'BOW_CHARGE' |
	'GUN_1H_ATTACK' | 'GUN_1H_CRIPPLE' |
	'GUN_2H_ATTACK' | 'GUN_2H_PIERCE'
>;

export type IShieldWeaponSkillList = IPartialWeaponSkillList<
	'SHIELD_SMALL_BLOCK' |
	'SHIELD_LARGE_BLOCK'
>;

export type IWield1HWeaponSkillList = IPartialWeaponSkillList<
	'SWORD_1H_ATTACK' | 'SWORD_1H_BLEED' |
	'AXE_1H_ATTACK' | 'AXE_1H_SMASH' |
	'HAMMER_1H_ATTACK' | 'HAMMER_1H_STUN'
>;

export type IWield2HWeaponSkillList = IPartialWeaponSkillList<
	'SPEAR_ATTACK' | 'SPEAR_THRUST' |
	'SWORD_2H_ATTACK' | 'SWORD_2H_CLEAVE' |
	'AXE_2H_ATTACK' | 'AXE_2H_WHIRLWIND' |
	'HAMMER_2H_ATTACK' | 'HAMMER_2H_SHOCKWAVE'
>;

export const attackSkills = [
	'FISTS_ATTACK', 'DAGGER_ATTACK',
	'SWORD_1H_ATTACK', 'AXE_1H_ATTACK', 'HAMMER_1H_ATTACK',
	'SPEAR_ATTACK',	'SWORD_2H_ATTACK', 'AXE_2H_ATTACK', 'HAMMER_2H_ATTACK',
	'MACE_ATTACK', 'STAFF_ATTACK',
	'BOW_ATTACK', 'GUN_1H_ATTACK', 'GUN_2H_ATTACK'
];
