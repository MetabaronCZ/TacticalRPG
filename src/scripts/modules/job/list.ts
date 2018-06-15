import DataList from 'core/data-list';

import { JobID, IJobData } from 'modules/job';
import { ArchetypeID } from 'modules/archetype';
import { ICharacterData } from 'modules/character-data';

class JobList extends DataList<JobID, IJobData> {
	public filter(char: ICharacterData) {
		const arch = (ArchetypeID as any)[char.primary + char.secondary];
		return this.filterFn((id, job) => this.check(arch, job));
	}

	private check(arch: ArchetypeID, job: IJobData): boolean {
		return !job.archetype || -1 !== job.archetype.indexOf(arch);
	}
}

export default JobList;
