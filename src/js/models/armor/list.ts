import { ArchetypeID } from 'models/archetype';
import { ICharacterData } from 'models/character';
import { ArmorID, IArmorData } from 'models/armor';
import DataList from 'models/data-list';

class ArmorList extends DataList<ArmorID, IArmorData> {
	constructor(entries: Array<[ArmorID, IArmorData]> = []) {
		super(entries);
	}

	public filter(char: ICharacterData): DataList<ArmorID, IArmorData> {
		const arch = (ArchetypeID as any)[char.primary + char.secondary];
		return super.filterFn((id, arm) => this.check(arch, arm));
	}

	private check(arch: ArchetypeID, arm: IArmorData): boolean {
		return !arm.archetype || !arm.archetype.length || -1 !== arm.archetype.indexOf(arch);
	}
}

export default ArmorList;