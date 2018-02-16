import { IAttributes, Attributes } from 'models/attributes';
import { ICharacterData } from 'models/character-data';
import { PlayerType } from 'models/player';
import { Position } from 'models/position';

export interface ICharacter {
	data: ICharacterData;
	position: Position;
	player: PlayerType;
	baseAttributes: IAttributes;
	currAttributes: IAttributes;
	isSelected: boolean;
	isActive: boolean;
}

export class Character {
	public static cpLimit = 100;

	public static create(type: PlayerType, data: ICharacterData, position: Position): ICharacter {
		return {
			data,
			position,
			player: type,
			baseAttributes: Attributes.create(data.primary, data.secondary),
			currAttributes: Attributes.create(data.primary, data.secondary),
			isSelected: false,
			isActive: false
		};
	}
}
