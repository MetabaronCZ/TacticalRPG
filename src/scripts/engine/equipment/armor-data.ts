import DataList from 'core/data-list';

import { ICharacterData } from 'engine/character-data';
import { checkArmorArchetype } from 'engine/utils/equipment';

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
		return checkArmorArchetype(armor, char.archetype);
	}
}
