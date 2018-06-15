import DataList from 'core/data-list';

import { ArchetypeID } from 'modules/archetype';
import { ArmorID, IArmorData } from 'modules/armor';
import { ICharacterData } from 'modules/character-data';

class ArmorList extends DataList<ArmorID, IArmorData> {
	public filter(char: ICharacterData) {
		const arch = (ArchetypeID as any)[char.primary + char.secondary];
		return super.filterFn((id, arm) => this.check(arch, arm));
	}

	private check(arch: ArchetypeID, arm: IArmorData): boolean {
		return !arm.archetype || !arm.archetype.length || -1 !== arm.archetype.indexOf(arch);
	}
}

export default ArmorList;
