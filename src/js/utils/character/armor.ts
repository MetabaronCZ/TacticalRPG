import { ICharacter } from 'models/character';
import { ArchetypeID } from 'models/archetype';
import { ArmorID, IArmor } from 'models/armor';
import Armors from 'data/armor';

export const filter = (char: ICharacter): ArmorID[] => {
	const arch = (ArchetypeID as any)[char.primary + char.secondary];
	const filtered: ArmorID[] = [];

	for (const id in Armors) {
		if (!Armors[id]) {
			continue;
		}
		const arm = Armors[id];

		if (!arm.archetype || !arm.archetype.length || -1 !== arm.archetype.indexOf(arch)) {
			filtered.push(id as ArmorID);
		}
	}

	return filtered;
};
