import { ICharacter } from 'models/character';
import { IIndexable } from 'utils/array';

export interface IParty extends IIndexable {
	name: string;
	characters: string[];
}
