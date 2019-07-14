import Character from 'modules/character';
import { IPlayerConfig } from 'modules/battle-configuration/player-config';

class Player {
	public readonly data: IPlayerConfig;
	public readonly id: number;
	public readonly name: string;
	protected characters: Character[] = [];

	constructor(id: number, data: IPlayerConfig) {
		this.id = id;
		this.data = data;
		this.name = data.name;
	}

	public getCharacters(): Character[] {
		return this.characters;
	}

	public setCharacters(characters: Character[]) {
		this.characters = characters;
	}
}

export default Player;
