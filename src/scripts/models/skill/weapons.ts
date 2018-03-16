import DataList from 'models/data-list';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

export enum WeaponSKillID {
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
	GUN_2H_SPREAD = 'GUN_2H_SPREAD',
	SHIELD_SMALL_BLOCK = 'SHIELD_SMALL_BLOCK',
	SHIELD_LARGE_BLOCK = 'SHIELD_LARGE_BLOCK'
}

export const WeaponSKills = new DataList<WeaponSKillID, ISKill> ([
	[WeaponSKillID.FISTS_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.FISTS_DISARM, {
		title: 'Disarm',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.DAGGER_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.DAGGER_STAB, {
		title: 'Stab',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.SWORD_1H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.SWORD_1H_BLEED, {
		title: 'Bleed',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.AXE_1H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.AXE_1H_SMASH, {
		title: 'Smash',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.HAMMER_1H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.HAMMER_1H_STUN, {
		title: 'Stun',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.SPEAR_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.SPEAR_THRUST, {
		title: 'Thrust',
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.SWORD_2H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.SWORD_2H_CLEAVE, {
		title: 'Cleave',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.AXE_2H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.AXE_2H_WHIRLWIND, {
		title: 'Whirlwind',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.HAMMER_2H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.HAMMER_2H_SHOCKWAVE, {
		title: 'Shockwave',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.MACE_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.STAFF_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.BOW_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.BOW_CHARGE, {
		title: 'Charge',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.GUN_1H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.GUN_1H_CRIPPLE, {
		title: 'Cripple',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.GUN_2H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.GUN_2H_SPREAD, {
		title: 'Spread',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.SHIELD_SMALL_BLOCK, {
		title: 'Block',
		type: SKillType.REACTIVE,
		range: SKillRange.R0,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.SHIELD_LARGE_BLOCK, {
		title: 'Block',
		type: SKillType.REACTIVE,
		range: SKillRange.R0,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
]);
