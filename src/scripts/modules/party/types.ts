import { IIndexable } from 'modules/indexable/types';

export interface IParty extends IIndexable {
	readonly name: string;
	readonly characters: string[];  // list of character IDs
}

export type IOnMoveDown = (partyId: string) => () => void;
export type IOnMoveUp = (partyId: string) => () => void;
export type IOnDelete = (party: IParty) => () => void;
