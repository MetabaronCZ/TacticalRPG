import Character from 'modules/character';

class Player {
	public readonly id: number;
	public readonly name: string;
	protected characters: Character[] = [];

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}

	public getCharacters(): Character[] {
		return this.characters;
	}

	public setCharacters(characters: Character[]) {
		this.characters = characters;
	}
}

export default Player;
