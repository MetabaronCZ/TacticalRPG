import DataList from 'core/data-list';

import Equipment from 'modules/equipment';
import { ArmorID, IArmorData } from 'modules/armor/types';
import { ICharacterData } from 'modules/character-data/types';

class ArmorList extends DataList<ArmorID, IArmorData> {
	public filter(char: ICharacterData) {
		return super.filterFn((id, arm) => this.check(id, char));
	}

	private check(armor: ArmorID, char: ICharacterData): boolean {
		return Equipment.checkArmor(armor, char.archetype);
	}
}

export default ArmorList;
