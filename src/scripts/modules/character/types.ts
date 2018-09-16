import { PlayerType } from 'modules/player/types';
import { IPosition } from 'modules/position/types';
import { IAttributes } from 'modules/attributes/types';

import { DirectionID } from 'engine/direction';
import { IStatusEffect } from 'engine/status-effect';
import { ICharacterData } from 'engine/character-data';

export interface ICharacter {
	readonly data: ICharacterData;
	readonly player: PlayerType;
	readonly baseAttributes: IAttributes;
	currAttributes: IAttributes;
	position: IPosition;
	direction: DirectionID;
	readonly status: IStatusEffect[];
}
