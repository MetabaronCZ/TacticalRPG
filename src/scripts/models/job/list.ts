import DataList from 'core/data-list';

import { JobID, IJobData } from 'models/job';
import { ArchetypeID } from 'models/archetype';
import { ICharacterData } from 'models/character-data';

class JobList extends DataList<JobID, IJobData> {
	public filter(char: ICharacterData): DataList<JobID, IJobData> {
		const arch = (ArchetypeID as any)[char.primary + char.secondary];
		return this.filterFn((id, job) => this.check(arch, job));
	}

	private check(arch: ArchetypeID, job: IJobData): boolean {
		return !job.archetype || -1 !== job.archetype.indexOf(arch);
	}
}

export default JobList;
