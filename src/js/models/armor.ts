import { EArchetypes } from 'models/archetypes';

export default interface IArmor {
	title: string;
	description: string;
	archetype?: EArchetypes[];
}
