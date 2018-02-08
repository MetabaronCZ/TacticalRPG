import { ArchetypeID } from 'models/archetype';
import { SkillSetID } from 'models/skill-set-data';

export default interface IJobData {
	readonly title: string;
	readonly description: string;
	readonly archetype: ArchetypeID[];
	readonly skills: SkillSetID[];
}
