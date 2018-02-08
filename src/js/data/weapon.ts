import { WeaponID, WeaponTypeID, IWeaponData } from 'models/weapon';
import { WieldID } from 'models/wield';

const weaponData: Array<[WeaponID, IWeaponData]> = [
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
];

export default weaponData;
