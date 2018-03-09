import { IParty } from 'models/party';
import { ICharacterData } from 'models/character-data';

export interface IApp {
	readonly characters: ICharacterData[];
	readonly parties: IParty[];
}

export class App {
	public static getDefault(): IApp {
		return {
			characters: [],
			parties: []
		};
	}
}
