import { ICharacter } from 'models/character';

export interface IParty {
	name: string;
	characters: ICharacter[];
}
