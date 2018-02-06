import JobList from 'data/job-list';
import { ICharacter } from 'models/character';
import { JobID, IJob } from 'models/job';
import { ArchetypeID } from 'models/archetype';

export const filter = (char: ICharacter): Map<JobID, IJob> => {
	const arch = (ArchetypeID as any)[char.primary + char.secondary];
	const filtered = new Map();

	JobList.forEach((job, id) => {
		if (!job.archetype || -1 !== job.archetype.indexOf(arch)) {
			filtered.set(id, job);
		}
	});

	return filtered;
};
