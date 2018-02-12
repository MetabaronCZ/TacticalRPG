import WeaponList from 'models/weapon/list';
import { WieldID } from 'models/wield';

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
}

export const Weapons = new WeaponList([
	[WeaponID.NONE, {
		title: 'none',
		description: 'No weapon equipped',
		type: WeaponTypeID.NONE,
		wield: [WieldID.MAIN, WieldID.OFF]
	}],
	[WeaponID.FISTS, {
		title: 'Fists',
		description: '',
		type: WeaponTypeID.DUAL,
		wield: [WieldID.BOTH]
	}],
	[WeaponID.DAGGER, {
		title: 'Dagger',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		wield: [WieldID.MAIN, WieldID.OFF]
	}],
	[WeaponID.SWORD_1H, {
		title: '1H Sword',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		wield: [WieldID.MAIN, WieldID.OFF]
	}],
	[WeaponID.AXE_1H, {
		title: '1H Axe',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		wield: [WieldID.MAIN, WieldID.OFF]
	}],
	[WeaponID.HAMMER_1H, {
		title: '1H Hammer',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		wield: [WieldID.MAIN, WieldID.OFF]
	}],
	[WeaponID.SPEAR, {
		title: 'Spear',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		wield: [WieldID.BOTH]
	}],
	[WeaponID.SWORD_2H, {
		title: '2H Sword',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		wield: [WieldID.BOTH]
	}],
	[WeaponID.AXE_2H, {
		title: '2H Axe',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		wield: [WieldID.BOTH]
	}],
	[WeaponID.HAMMER_2H, {
		title: '2H Hammer',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		wield: [WieldID.BOTH]
	}],
	[WeaponID.MACE, {
		title: 'Mace',
		description: '',
		type: WeaponTypeID.MAGICAL,
		wield: [WieldID.MAIN]
	}],
	[WeaponID.STAFF, {
		title: 'Staff',
		description: '',
		type: WeaponTypeID.MAGICAL,
		wield: [WieldID.BOTH]
	}],
	[WeaponID.BOW, {
		title: 'Bow',
		description: '',
		type: WeaponTypeID.RANGED,
		wield: [WieldID.BOTH]
	}],
	[WeaponID.GUN_1H, {
		title: '1H Gun',
		description: '',
		type: WeaponTypeID.RANGED,
		wield: [WieldID.MAIN, WieldID.OFF]
	}],
	[WeaponID.GUN_2H, {
		title: '2H Gun',
		description: '',
		type: WeaponTypeID.RANGED,
		wield: [WieldID.BOTH]
	}],
	[WeaponID.SHIELD_SMALL, {
		title: 'Small Shield',
		description: '',
		type: WeaponTypeID.SHIELD,
		wield: [WieldID.OFF]
	}],
	[WeaponID.SHIELD_LARGE, {
		title: 'Large Shield',
		description: '',
		type: WeaponTypeID.SHIELD,
		wield: [WieldID.OFF]
	}]
]);
