import { WeaponSkillID } from 'engine/skill/weapon';

export type WeaponID =
	'NONE' |
	'FISTS' | 'DAGGER' | 'SWORD_1H' | 'AXE_1H' | 'HAMMER_1H' |
	'SPEAR' | 'SWORD_2H' | 'AXE_2H' | 'HAMMER_2H' |
	'MACE' | 'STAFF' |
	'BOW' | 'GUN_1H' | 'GUN_2H' |
	'SHIELD_SMALL' | 'SHIELD_LARGE';

export type WeaponTypeID =
	'NONE' | 'DUAL' | 'ONE_HANDED' | 'TWO_HANDED' | 'MAGICAL' | 'RANGED' | 'SHIELD';

export interface IWeaponData {
	readonly title: string;
	readonly description: string;
	readonly type: WeaponTypeID;
	readonly skills: WeaponSkillID[];
	readonly damage: number;
	readonly magic: number;
}
