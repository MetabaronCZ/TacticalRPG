import { IIndexableData } from 'engine/indexable-data';

export interface IPartyData extends IIndexableData {
	readonly name: string;
	readonly characters: string[];  // list of character IDs
}
