import DataList from 'core/data-list';

import Equipment from 'modules/equipment';
import { ICharacterData } from 'engine/character-data';

export type ArmorID = 'NONE' | 'ROBE' | 'LIGHT' | 'HEAVY';

export interface IArmorData {
	readonly title: string;
	readonly description: string;
	readonly physicalDefense: number;
	readonly magicalDefense: number;
}

export class ArmorList extends DataList<ArmorID, IArmorData> {
	public filter(char: ICharacterData) {
		return super.filterFn((id, arm) => this.check(id, char));
	}

	private check(armor: ArmorID, char: ICharacterData): boolean {
		return Equipment.checkArmor(armor, char.archetype);
	}
}
