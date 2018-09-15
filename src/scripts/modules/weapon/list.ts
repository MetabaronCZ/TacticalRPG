import DataList from 'core/data-list';

import Equipment from 'modules/equipment';
import { IEquipSlot } from 'modules/equipment/types';
import { WeaponID, IWeaponData } from 'modules/weapon/types';
import { ICharacterData } from 'modules/character-data/types';

class WeaponList extends DataList<WeaponID, IWeaponData> {
	public filter(char: ICharacterData, slot: IEquipSlot) {
		return super.filterFn((id, wpn) => this.check(id, char, slot));
	}

	private check(weapon: WeaponID, char: ICharacterData, slot: IEquipSlot): boolean {
		switch (slot) {
			case 'MAIN':
				return Equipment.checkMainHand(weapon, char.archetype);

			case 'OFF':
				return Equipment.checkOffHand(weapon, char.archetype, char.main);

			default:
				throw new Error(`Invalid equip slot: ${slot}`);
		}
	}
}

export default WeaponList;
