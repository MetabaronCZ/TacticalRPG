import { PlayerType } from 'modules/player/types';
import { IPosition } from 'modules/position/types';
import { IAttributes } from 'modules/attributes/types';
import { ICharacterData } from 'modules/character-data/types';

import { DirectionID } from 'engine/direction';
import { IStatusEffect } from 'engine/status-effect';

export interface ICharacter {
	readonly data: ICharacterData;
	readonly player: PlayerType;
	readonly baseAttributes: IAttributes;
	currAttributes: IAttributes;
	position: IPosition;
	direction: DirectionID;
	readonly status: IStatusEffect[];
}
