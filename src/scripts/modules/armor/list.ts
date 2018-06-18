import DataList from 'core/data-list';

import { ArchetypeID } from 'modules/archetype';
import { ArmorID, IArmorData } from 'modules/armor';
import { ICharacterData } from 'modules/character-data';

class ArmorList extends DataList<ArmorID, IArmorData> {
	public filter(char: ICharacterData) {
		return super.filterFn((id, arm) => this.check(char.archetype, arm));
	}

	private check(arch: ArchetypeID, arm: IArmorData): boolean {
		return !arm.archetype || !arm.archetype.length || -1 !== arm.archetype.indexOf(arch);
	}
}

export default ArmorList;
