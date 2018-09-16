import DataList from 'core/data-list';

import { ICharacterData } from 'engine/character-data';
import { IEquipSlot } from 'engine/equipment/equipable';
import { EquipmentUtils } from 'engine/equipment/utils';
import { WeaponSkillID } from 'engine/skill/weapon/types';

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

export class WeaponList extends DataList<WeaponID, IWeaponData> {
	public filter(char: ICharacterData, slot: IEquipSlot) {
		return super.filterFn((id, wpn) => this.check(id, char, slot));
	}

	private check(weapon: WeaponID, char: ICharacterData, slot: IEquipSlot): boolean {
		switch (slot) {
			case 'MAIN':
				return EquipmentUtils.checkMainHand(weapon, char.archetype);

			case 'OFF':
				return EquipmentUtils.checkOffHand(weapon, char.archetype, char.main);

			default:
				throw new Error(`Invalid equip slot: ${slot}`);
		}
	}
}