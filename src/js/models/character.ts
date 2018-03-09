import { Position } from 'models/position';
import { PlayerType } from 'models/player';
import { IAttributes } from 'models/attributes';
import { ICharacterData } from 'models/character-data';

export interface ICharacter {
	data: ICharacterData;
	position: Position;
	player: PlayerType;
	baseAttributes: IAttributes;
	currAttributes: IAttributes;
}

export class Character {
	// maximum point of CP of every character
	public static cpLimit = 100;
}
