import Character from 'engine/character';
import { IPartyData } from 'engine/party-data';
import { ICharacterData } from 'engine/character-data';
import { PlayerControlID } from 'engine/player-control';

export interface IPlayerData {
	readonly name: string;
	readonly control: PlayerControlID;
	readonly party: string;
	readonly parties: IPartyData[];
	readonly characters: ICharacterData[];
}

class Player {
	public readonly name: string;
	public readonly control: PlayerControlID;
	public readonly characters: Character[] = [];

	constructor(name: string, control: PlayerControlID, characters: Character[]) {
		this.name = name;
		this.control = control;
		this.characters = characters;
	}
}

export default Player;
