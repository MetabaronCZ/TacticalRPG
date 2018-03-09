import { Position } from 'models/position';
import { PlayerType } from 'models/player';
import { ICharacterData } from 'models/character-data';
import { IAttributes, Attributes } from 'models/attributes';

export interface ICharacter {
	data: ICharacterData;
	player: PlayerType;
	position: Position;
	baseAttributes: IAttributes;
	currAttributes: IAttributes;
}

export class Character {
	// maximum point of CP of every character
	public static cpLimit = 100;

	public static create(data: ICharacterData, position: Position, player: PlayerType): ICharacter {
		return {
			data,
			player,
			position,
			baseAttributes: Attributes.create(data.primary, data.secondary),
			currAttributes: Attributes.create(data.primary, data.secondary)
		};
	}
}
