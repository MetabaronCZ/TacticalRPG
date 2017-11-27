import { EArchetypes } from 'models/archetypes';
import { ESkillSet } from 'models/skill-set';

export default interface IJob {
	title: string;
	description: string;
	archetype: EArchetypes[];
	skills: ESkillSet;
}
