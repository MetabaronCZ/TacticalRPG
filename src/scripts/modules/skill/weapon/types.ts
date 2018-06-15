import { ISkill } from 'modules/skill';

type IPartialWeaponSkillList<T extends WeaponSkillID> = {
	[id in T]: ISkill;
};

export enum WeaponSkillID {
	FISTS_ATTACK = 'FISTS_ATTACK',
	FISTS_DISARM = 'FISTS_DISARM',
	DAGGER_ATTACK = 'DAGGER_ATTACK',
	DAGGER_STAB = 'DAGGER_STAB',
	SWORD_1H_ATTACK = 'SWORD_1H_ATTACK',
	SWORD_1H_BLEED = 'SWORD_1H_BLEED',
	AXE_1H_ATTACK = 'AXE_1H_ATTACK',
	AXE_1H_SMASH = 'AXE_1H_SMASH',
	HAMMER_1H_ATTACK = 'HAMMER_1H_ATTACK',
	HAMMER_1H_STUN = 'HAMMER_1H_STUN',
	SPEAR_ATTACK = 'SPEAR_ATTACK',
	SPEAR_THRUST = 'SPEAR_THRUST',
	SWORD_2H_ATTACK = 'SWORD_2H_ATTACK',
	SWORD_2H_CLEAVE = 'SWORD_2H_CLEAVE',
	AXE_2H_ATTACK = 'AXE_2H_ATTACK',
	AXE_2H_WHIRLWIND = 'AXE_2H_WHIRLWIND',
	HAMMER_2H_ATTACK = 'HAMMER_2H_ATTACK',
	HAMMER_2H_SHOCKWAVE = 'HAMMER_2H_SHOCKWAVE',
	MACE_ATTACK = 'MACE_ATTACK',
	STAFF_ATTACK = 'STAFF_ATTACK',
	BOW_ATTACK = 'BOW_ATTACK',
	BOW_CHARGE = 'BOW_CHARGE',
	GUN_1H_ATTACK = 'GUN_1H_ATTACK',
	GUN_1H_CRIPPLE = 'GUN_1H_CRIPPLE',
	GUN_2H_ATTACK = 'GUN_2H_ATTACK',
	GUN_2H_PIERCE = 'GUN_2H_PIERCE',
	SHIELD_SMALL_BLOCK = 'SHIELD_SMALL_BLOCK',
	SHIELD_LARGE_BLOCK = 'SHIELD_LARGE_BLOCK'
}

export type ISmallWeaponSkillList = IPartialWeaponSkillList<
	WeaponSkillID.FISTS_ATTACK|
	WeaponSkillID.FISTS_DISARM|
	WeaponSkillID.DAGGER_ATTACK|
	WeaponSkillID.DAGGER_STAB
>;

export type IMagicalWeaponSkillList = IPartialWeaponSkillList<
	WeaponSkillID.MACE_ATTACK|
	WeaponSkillID.STAFF_ATTACK
>;

export type IRangedWeaponSkillList = IPartialWeaponSkillList<
	WeaponSkillID.BOW_ATTACK|
	WeaponSkillID.BOW_CHARGE|
	WeaponSkillID.GUN_1H_ATTACK|
	WeaponSkillID.GUN_1H_CRIPPLE|
	WeaponSkillID.GUN_2H_ATTACK|
	WeaponSkillID.GUN_2H_PIERCE
>;

export type IShieldWeaponSkillList = IPartialWeaponSkillList<
	WeaponSkillID.SHIELD_SMALL_BLOCK|
	WeaponSkillID.SHIELD_LARGE_BLOCK
>;

export type IWield1HWeaponSkillList = IPartialWeaponSkillList<
	WeaponSkillID.SWORD_1H_ATTACK|
	WeaponSkillID.SWORD_1H_BLEED|
	WeaponSkillID.AXE_1H_ATTACK|
	WeaponSkillID.AXE_1H_SMASH|
	WeaponSkillID.HAMMER_1H_ATTACK|
	WeaponSkillID.HAMMER_1H_STUN
>;

export type IWield2HWeaponSkillList = IPartialWeaponSkillList<
	WeaponSkillID.SPEAR_ATTACK|
	WeaponSkillID.SPEAR_THRUST|
	WeaponSkillID.SWORD_2H_ATTACK|
	WeaponSkillID.SWORD_2H_CLEAVE|
	WeaponSkillID.AXE_2H_ATTACK|
	WeaponSkillID.AXE_2H_WHIRLWIND|
	WeaponSkillID.HAMMER_2H_ATTACK|
	WeaponSkillID.HAMMER_2H_SHOCKWAVE
>;

export const attackSkills = [
	WeaponSkillID.FISTS_ATTACK,
	WeaponSkillID.DAGGER_ATTACK,
	WeaponSkillID.SWORD_1H_ATTACK,
	WeaponSkillID.AXE_1H_ATTACK,
	WeaponSkillID.HAMMER_1H_ATTACK,
	WeaponSkillID.SPEAR_ATTACK,
	WeaponSkillID.SWORD_2H_ATTACK,
	WeaponSkillID.AXE_2H_ATTACK,
	WeaponSkillID.HAMMER_2H_ATTACK,
	WeaponSkillID.MACE_ATTACK,
	WeaponSkillID.STAFF_ATTACK,
	WeaponSkillID.BOW_ATTACK,
	WeaponSkillID.GUN_1H_ATTACK,
	WeaponSkillID.GUN_2H_ATTACK
];
