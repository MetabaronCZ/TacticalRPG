import { ICharacter } from 'models/character';
import { ArchetypeID } from 'models/archetype';
import { ArmorID, IArmor } from 'models/armor';
import ArmorList from 'data/armor-list';

export const filter = (char: ICharacter): Map<ArmorID, IArmor> => {
	const arch = (ArchetypeID as any)[char.primary + char.secondary];
	const filtered = new Map<ArmorID, IArmor>();

	ArmorList.forEach((arm, id) => {
		if (!arm.archetype || !arm.archetype.length || -1 !== arm.archetype.indexOf(arch)) {
			filtered.set(id, arm);
		}
	});

	return filtered;
};
