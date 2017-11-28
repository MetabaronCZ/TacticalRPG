import { WeaponTypeID } from 'models/weapon-types';
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

export interface IWeapon {
	readonly title: string;
	readonly description: string;
	readonly type: WeaponTypeID;
	readonly wield: WieldID[];
}
