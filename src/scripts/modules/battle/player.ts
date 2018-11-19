import Character from 'modules/character';

class Player {
	protected characters: Character[] = [];
	private name: string;

	constructor(name: string) {
		this.name = name;
	}

	public getName(): string {
		return this.name;
	}

	public getCharacters(): Character[] {
		return this.characters;
	}

	public setName(name: string) {
		this.name = name;
	}

	public setCharacters(characters: Character[]) {
		this.characters = characters;
	}
}

export default Player;
