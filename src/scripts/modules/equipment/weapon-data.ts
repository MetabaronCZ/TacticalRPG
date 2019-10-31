import { WeaponSkillID } from 'modules/skill/weapon';

export type WeaponID =
	'NONE' |
	'FISTS' | 'DAGGER' |
	'SWORD_1H' | 'AXE_1H' | 'MACE_1H' |
	'SPEAR' |
	'SWORD_2H' | 'AXE_2H' | 'MACE_2H' |
	'ROD' | 'STAFF' | 'AETHERBLADE' |
	'BOW' | 'GUN' |
	'SHIELD_SMALL' | 'SHIELD_LARGE';

export type WeaponTypeID =
	'NONE' | 'DUAL' | 'ONE_HANDED' | 'TWO_HANDED' | 'MAGICAL' | 'RANGED' | 'SHIELD';

export const meleeWeapons: WeaponTypeID[] = ['DUAL', 'ONE_HANDED', 'TWO_HANDED'];

export interface IWeaponData {
	readonly id: WeaponID;
	readonly title: string;
	readonly description: string;
	readonly type: WeaponTypeID;
	readonly skills: WeaponSkillID[];
	readonly physical: number;
	readonly magical: number;
	readonly block?: number;
}
