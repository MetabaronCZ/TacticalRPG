import { Character } from 'models/character';
import { ICharacterConfig } from 'models/character/character';

class Player {
	private characters: Character[];
	private enemy: boolean;

	constructor(characters: ICharacterConfig[], isEnemy: boolean) {
		this.characters = characters.map((char) => new Character(char, this));
		this.enemy = !!isEnemy;
	}

	public getCharacters(): Character[] {
		return this.characters;
	}

	public isEnemy(): boolean {
		return this.enemy;
	}
}

export default Player;
