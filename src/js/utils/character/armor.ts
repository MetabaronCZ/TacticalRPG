import ICharacter from 'models/character';
import { EArchetypes } from 'models/archetypes';
import { ArmorID, IArmor } from 'models/armor';
import Armors from 'data/armor';

export const filter = (char: ICharacter): ArmorID[] => {
	const arch = (EArchetypes as any)[char.primary + char.secondary];
	const filtered: ArmorID[] = [];

	Armors.forEach((arm: IArmor, id: ArmorID) => {
		if (!arm.archetype || !arm.archetype.length || -1 !== arm.archetype.indexOf(arch)) {
			filtered.push(id);
		}
	});

	return filtered;
};
