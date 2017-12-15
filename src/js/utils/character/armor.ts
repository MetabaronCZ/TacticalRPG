import { ICharacter } from 'models/character';
import { ArchetypeID } from 'models/archetype';
import { ArmorID, IArmor } from 'models/armor';
import ArmorList from 'data/armor-list';

export const filter = (char: ICharacter): ArmorID[] => {
	const arch = (ArchetypeID as any)[char.primary + char.secondary];
	const filtered: ArmorID[] = [];

	ArmorList.forEach((arm: IArmor, id: ArmorID) => {
		if (!arm.archetype || !arm.archetype.length || -1 !== arm.archetype.indexOf(arch)) {
			filtered.push(id);
		}
	});

	return filtered;
};
