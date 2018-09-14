import Character from 'engine/character';

import { IParty } from 'modules/party/types';
import { ICharacterData } from 'modules/character-data/types';

export type PlayerControl = 'HUMAN' | 'AI';

export interface IPlayerData {
	control: PlayerControl;
	readonly party?: IParty;
	readonly characters?: ICharacterData[];
}

class Player {
	private control: PlayerControl;
	private characters: Character[] = [];

	constructor(characters: Character[], control: PlayerControl) {
		this.characters = characters;
		this.control = control;
	}

	public getCharacters(): Character[] {
		return this.characters;
	}

	public getControl(): PlayerControl {
		return this.control;
	}
}

export default Player;
