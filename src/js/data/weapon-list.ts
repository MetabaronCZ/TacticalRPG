import { WeaponID, IWeapon } from 'models/weapon';
import { WieldID } from 'models/wield';
import { WeaponTypeID } from 'models/weapon-types';

const WeaponList = new Map<WeaponID, IWeapon>();

WeaponList.set(WeaponID.NONE, {
	title: 'none',
	description: 'No weapon equipped',
	type: WeaponTypeID.NONE,
	wield: [WieldID.MAIN, WieldID.OFF]
});

WeaponList.set(WeaponID.FISTS, {
	title: 'Fists',
	description: '',
	type: WeaponTypeID.DUAL,
	wield: [WieldID.BOTH]
});

WeaponList.set(WeaponID.DAGGER, {
	title: 'Dagger',
	description: '',
	type: WeaponTypeID.ONE_HANDED,
	wield: [WieldID.MAIN, WieldID.OFF]
});

WeaponList.set(WeaponID.SWORD_1H, {
	title: '1H Sword',
	description: '',
	type: WeaponTypeID.ONE_HANDED,
	wield: [WieldID.MAIN, WieldID.OFF]
});

WeaponList.set(WeaponID.AXE_1H, {
	title: '1H Axe',
	description: '',
	type: WeaponTypeID.ONE_HANDED,
	wield: [WieldID.MAIN, WieldID.OFF]
});

WeaponList.set(WeaponID.HAMMER_1H, {
	title: '1H Hammer',
	description: '',
	type: WeaponTypeID.ONE_HANDED,
	wield: [WieldID.MAIN, WieldID.OFF]
});

WeaponList.set(WeaponID.SPEAR, {
	title: 'Spear',
	description: '',
	type: WeaponTypeID.TWO_HANDED,
	wield: [WieldID.BOTH]
});

WeaponList.set(WeaponID.SWORD_2H, {
	title: '2H Sword',
	description: '',
	type: WeaponTypeID.TWO_HANDED,
	wield: [WieldID.BOTH]
});

WeaponList.set(WeaponID.AXE_2H, {
	title: '2H Axe',
	description: '',
	type: WeaponTypeID.TWO_HANDED,
	wield: [WieldID.BOTH]
});

WeaponList.set(WeaponID.HAMMER_2H, {
	title: '2H Hammer',
	description: '',
	type: WeaponTypeID.TWO_HANDED,
	wield: [WieldID.BOTH]
});

WeaponList.set(WeaponID.MACE, {
	title: 'Mace',
	description: '',
	type: WeaponTypeID.MAGICAL,
	wield: [WieldID.MAIN]
});

WeaponList.set(WeaponID.STAFF, {
	title: 'Staff',
	description: '',
	type: WeaponTypeID.MAGICAL,
	wield: [WieldID.BOTH]
});

WeaponList.set(WeaponID.BOW, {
	title: 'Bow',
	description: '',
	type: WeaponTypeID.RANGED,
	wield: [WieldID.BOTH]
});

WeaponList.set(WeaponID.GUN_1H, {
	title: '1H Gun',
	description: '',
	type: WeaponTypeID.RANGED,
	wield: [WieldID.MAIN, WieldID.OFF]
});

WeaponList.set(WeaponID.GUN_2H, {
	title: '2H Gun',
	description: '',
	type: WeaponTypeID.RANGED,
	wield: [WieldID.BOTH]
});

WeaponList.set(WeaponID.SHIELD_SMALL, {
	title: 'Small Shield',
	description: '',
	type: WeaponTypeID.SHIELD,
	wield: [WieldID.OFF]
});

WeaponList.set(WeaponID.SHIELD_LARGE, {
	title: 'Large Shield',
	description: '',
	type: WeaponTypeID.SHIELD,
	wield: [WieldID.OFF]
});

export default WeaponList;
