import { Direction } from 'modules/direction';
import { PlayerType } from 'modules/player/types';
import { IPosition } from 'modules/position/types';
import { IAttributes } from 'modules/attributes/types';
import { IStatusEffect } from 'modules/status-effect/types';
import { ICharacterData } from 'modules/character-data/types';

export interface ICharacter {
	readonly data: ICharacterData;
	readonly player: PlayerType;
	readonly baseAttributes: IAttributes;
	currAttributes: IAttributes;
	position: IPosition;
	direction: Direction;
	readonly status: IStatusEffect[];
}
