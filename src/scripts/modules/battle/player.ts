import Character from 'modules/character';
import { IPlayerData } from 'modules/battle-configuration/player-data';

class Player {
	public readonly id: number;
	public readonly name: string;
	public readonly data: IPlayerData;
	protected characters: Character[] = [];

	constructor(data: IPlayerData) {
		this.data = data;
		this.id = data.id;
		this.name = data.name;
	}

	public getCharacters(): Character[] {
		return [...this.characters];
	}

	public setCharacters(characters: Character[]) {
		this.characters = characters;
	}
}

export default Player;
