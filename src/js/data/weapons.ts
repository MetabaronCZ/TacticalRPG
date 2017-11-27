import IWeapon from 'models/weapon';
import { EWeapons } from 'models/weapons';
import { EWieldTypes } from 'models/wield-types';
import { EWeaponTypes } from 'models/weapon-types';

interface IWeapons {
	[weapon: string]: IWeapon;
}

const Weapons: IWeapons = {
	[EWeapons.NONE]: {
		title: 'none',
		description: 'No weapon equipped',
		type: EWeaponTypes.NONE,
		wield: [EWieldTypes.MAIN, EWieldTypes.OFF]
	},
	[EWeapons.FISTS]: {
		title: 'Fists',
		description: '',
		type: EWeaponTypes.DUAL,
		wield: [EWieldTypes.BOTH]
	},
	[EWeapons.DAGGER]: {
		title: 'Dagger',
		description: '',
		type: EWeaponTypes.ONE_HANDED,
		wield: [EWieldTypes.MAIN, EWieldTypes.OFF]
	},
	[EWeapons.SWORD_1H]: {
		title: '1H Sword',
		description: '',
		type: EWeaponTypes.ONE_HANDED,
		wield: [EWieldTypes.MAIN, EWieldTypes.OFF]
	},
	[EWeapons.AXE_1H]: {
		title: '1H Axe',
		description: '',
		type: EWeaponTypes.ONE_HANDED,
		wield: [EWieldTypes.MAIN, EWieldTypes.OFF]
	},
	[EWeapons.HAMMER_1H]: {
		title: '1H Hammer',
		description: '',
		type: EWeaponTypes.ONE_HANDED,
		wield: [EWieldTypes.MAIN, EWieldTypes.OFF]
	},
	[EWeapons.SPEAR]: {
		title: 'Spear',
		description: '',
		type: EWeaponTypes.TWO_HANDED,
		wield: [EWieldTypes.BOTH]
	},
	[EWeapons.SWORD_2H]: {
		title: '2H Sword',
		description: '',
		type: EWeaponTypes.TWO_HANDED,
		wield: [EWieldTypes.BOTH]
	},
	[EWeapons.AXE_2H]: {
		title: '2H Axe',
		description: '',
		type: EWeaponTypes.TWO_HANDED,
		wield: [EWieldTypes.BOTH]
	},
	[EWeapons.HAMMER_2H]: {
		title: '2H Hammer',
		description: '',
		type: EWeaponTypes.TWO_HANDED,
		wield: [EWieldTypes.BOTH]
	},
	[EWeapons.MACE]: {
		title: 'Mace',
		description: '',
		type: EWeaponTypes.MAGICAL,
		wield: [EWieldTypes.MAIN]
	},
	[EWeapons.STAFF]: {
		title: 'Staff',
		description: '',
		type: EWeaponTypes.MAGICAL,
		wield: [EWieldTypes.BOTH]
	},
	[EWeapons.BOW]: {
		title: 'Bow',
		description: '',
		type: EWeaponTypes.RANGED,
		wield: [EWieldTypes.BOTH]
	},
	[EWeapons.GUN_1H]: {
		title: '1H Gun',
		description: '',
		type: EWeaponTypes.RANGED,
		wield: [EWieldTypes.MAIN, EWieldTypes.OFF]
	},
	[EWeapons.GUN_2H]: {
		title: '2H Gun',
		description: '',
		type: EWeaponTypes.RANGED,
		wield: [EWieldTypes.BOTH]
	},
	[EWeapons.SHIELD_SMALL]: {
		title: 'Small Shield',
		description: '',
		type: EWeaponTypes.SHIELD,
		wield: [EWieldTypes.OFF]
	},
	[EWeapons.SHIELD_LARGE]: {
		title: 'Large Shield',
		description: '',
		type: EWeaponTypes.SHIELD,
		wield: [EWieldTypes.OFF]
	}
};

export default Weapons;
