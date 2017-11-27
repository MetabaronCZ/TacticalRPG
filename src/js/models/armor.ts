import { EArchetypes } from 'models/archetypes';

export enum ArmorID {
	NONE = 'NONE',
	ROBE = 'ROBE',
	LIGHT = 'LIGHT',
	HEAVY = 'HEAVY'
}

export interface IArmor {
	title: string;
	description: string;
	archetype: EArchetypes[];
}
