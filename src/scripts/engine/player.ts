import Character from 'engine/character';
import { PlayerControlID } from 'engine/player-config';

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
