import { PlayerType } from 'modules/player/types';
import { IPosition } from 'modules/position/types';
import { IAttributes } from 'modules/attributes/types';
import { IStatusEffect } from 'modules/status-effect/types';
import { ICharacterData } from 'modules/character-data/types';

import { DirectionID } from 'engine/direction';

export interface ICharacter {
	readonly data: ICharacterData;
	readonly player: PlayerType;
	readonly baseAttributes: IAttributes;
	currAttributes: IAttributes;
	position: IPosition;
	direction: DirectionID;
	readonly status: IStatusEffect[];
}
