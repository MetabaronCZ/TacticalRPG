import { ArchetypeID } from 'models/archetype';

export enum ArmorID {
	NONE = 'NONE',
	ROBE = 'ROBE',
	LIGHT = 'LIGHT',
	HEAVY = 'HEAVY'
}

export interface IArmor {
	readonly title: string;
	readonly description: string;
	readonly archetype: ArchetypeID[];
}
