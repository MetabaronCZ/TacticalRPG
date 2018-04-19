import WeaponList from 'models/weapon/list';
import { WieldID } from 'models/wield';
import { WeaponSkillID as SKillID } from 'models/skill/weapon/id';

export enum WeaponID {
	NONE = 'NONE',
	FISTS = 'FISTS',
	DAGGER = 'DAGGER',
	SWORD_1H = 'SWORD_1H',
	AXE_1H = 'AXE_1H',
	HAMMER_1H = 'HAMMER_1H',
	SPEAR = 'SPEAR',
	SWORD_2H = 'SWORD_2H',
	AXE_2H = 'AXE_2H',
	HAMMER_2H = 'HAMMER_2H',
	MACE = 'MACE',
	STAFF = 'STAFF',
	BOW = 'BOW',
	GUN_1H = 'GUN_1H',
	GUN_2H = 'GUN_2H',
	SHIELD_SMALL = 'SHIELD_SMALL',
	SHIELD_LARGE = 'SHIELD_LARGE'
}

export enum WeaponTypeID {
	NONE = 'NONE',
	DUAL = 'DUAL',
	ONE_HANDED = 'ONE_HANDED',
	TWO_HANDED = 'TWO_HANDED',
	MAGICAL = 'MAGICAL',
	RANGED = 'RANGED',
	SHIELD = 'SHIELD'
}

export interface IWeaponData {
	readonly title: string;
	readonly description: string;
	readonly type: WeaponTypeID;
	readonly wield: WieldID[];
	readonly skills: SKillID[];
}

export const Weapons = new WeaponList([
	[WeaponID.NONE, {
		title: 'none',
		description: 'No weapon equipped',
		type: WeaponTypeID.NONE,
		wield: [WieldID.MAIN, WieldID.OFF],
		skills: []
	}],
	[WeaponID.FISTS, {
		title: 'Fists',
		description: '',
		type: WeaponTypeID.DUAL,
		wield: [WieldID.DUAL],
		skills: [SKillID.FISTS_ATTACK, SKillID.FISTS_DISARM]
	}],
	[WeaponID.DAGGER, {
		title: 'Dagger',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		wield: [WieldID.MAIN, WieldID.OFF],
		skills: [SKillID.DAGGER_ATTACK, SKillID.DAGGER_STAB]
	}],
	[WeaponID.SWORD_1H, {
		title: '1H Sword',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		wield: [WieldID.MAIN, WieldID.OFF],
		skills: [SKillID.SWORD_1H_ATTACK, SKillID.SWORD_1H_BLEED]
	}],
	[WeaponID.AXE_1H, {
		title: '1H Axe',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		wield: [WieldID.MAIN, WieldID.OFF],
		skills: [SKillID.AXE_1H_ATTACK, SKillID.AXE_1H_SMASH]
	}],
	[WeaponID.HAMMER_1H, {
		title: '1H Hammer',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		wield: [WieldID.MAIN, WieldID.OFF],
		skills: [SKillID.HAMMER_1H_ATTACK, SKillID.HAMMER_1H_STUN]
	}],
	[WeaponID.SPEAR, {
		title: 'Spear',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		wield: [WieldID.BOTH],
		skills: [SKillID.SPEAR_ATTACK, SKillID.SPEAR_THRUST]
	}],
	[WeaponID.SWORD_2H, {
		title: '2H Sword',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		wield: [WieldID.BOTH],
		skills: [SKillID.SWORD_2H_ATTACK, SKillID.SWORD_2H_CLEAVE]
	}],
	[WeaponID.AXE_2H, {
		title: '2H Axe',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		wield: [WieldID.BOTH],
		skills: [SKillID.AXE_2H_ATTACK, SKillID.AXE_2H_WHIRLWIND]
	}],
	[WeaponID.HAMMER_2H, {
		title: '2H Hammer',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		wield: [WieldID.BOTH],
		skills: [SKillID.HAMMER_2H_ATTACK, SKillID.HAMMER_2H_SHOCKWAVE]
	}],
	[WeaponID.MACE, {
		title: 'Mace',
		description: '',
		type: WeaponTypeID.MAGICAL,
		wield: [WieldID.MAIN],
		skills: [SKillID.MACE_ATTACK]
	}],
	[WeaponID.STAFF, {
		title: 'Staff',
		description: '',
		type: WeaponTypeID.MAGICAL,
		wield: [WieldID.BOTH],
		skills: [SKillID.STAFF_ATTACK]
	}],
	[WeaponID.BOW, {
		title: 'Bow',
		description: '',
		type: WeaponTypeID.RANGED,
		wield: [WieldID.BOTH],
		skills: [SKillID.BOW_ATTACK, SKillID.BOW_CHARGE]
	}],
	[WeaponID.GUN_1H, {
		title: '1H Gun',
		description: '',
		type: WeaponTypeID.RANGED,
		wield: [WieldID.MAIN, WieldID.OFF],
		skills: [SKillID.GUN_1H_ATTACK, SKillID.GUN_1H_CRIPPLE]
	}],
	[WeaponID.GUN_2H, {
		title: '2H Gun',
		description: '',
		type: WeaponTypeID.RANGED,
		wield: [WieldID.BOTH],
		skills: [SKillID.GUN_2H_ATTACK, SKillID.GUN_2H_PIERCE]
	}],
	[WeaponID.SHIELD_SMALL, {
		title: 'Small Shield',
		description: '',
		type: WeaponTypeID.SHIELD,
		wield: [WieldID.OFF],
		skills: [SKillID.SHIELD_SMALL_BLOCK]
	}],
	[WeaponID.SHIELD_LARGE, {
		title: 'Large Shield',
		description: '',
		type: WeaponTypeID.SHIELD,
		wield: [WieldID.OFF],
		skills: [SKillID.SHIELD_LARGE_BLOCK]
	}]
]);
