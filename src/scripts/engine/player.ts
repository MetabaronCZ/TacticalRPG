import Character from 'engine/character';
import { IPartyData } from 'engine/party-data';
import { PlayerControlID } from 'engine/player-control';

import { ICharacterData } from 'modules/character-data/types';

export interface IPlayerData {
	readonly name: string;
	readonly control: PlayerControlID;
	readonly party: string;
	readonly parties: IPartyData[];
	readonly characters: ICharacterData[];
}

class Player {
	private name: string;
	private control: PlayerControlID;
	private characters: Character[] = [];

	constructor(name: string, control: PlayerControlID, characters: Character[]) {
		this.name = name;
		this.control = control;
		this.characters = characters;
	}

	public getName(): string {
		return this.name;
	}

	public getControl(): PlayerControlID {
		return this.control;
	}

	public getCharacters(): Character[] {
		return this.characters;
	}
}

export default Player;
