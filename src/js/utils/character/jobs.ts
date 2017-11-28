import Jobs from 'data/jobs';
import { ICharacter } from 'models/character';
import { JobID } from 'models/job';
import { ArchetypeID } from 'models/archetype';

export const filter = (char: ICharacter): JobID[] => {
	const arch = (ArchetypeID as any)[char.primary + char.secondary];
	const filtered: JobID[] = [];

	for (const id in Jobs) {
		if (!Jobs[id].archetype || -1 !== Jobs[id].archetype.indexOf(arch)) {
			filtered.push(id as JobID);
		}
	}

	return filtered;
};
