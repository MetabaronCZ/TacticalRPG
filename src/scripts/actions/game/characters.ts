import { IAction } from 'store';

import { Position } from 'models/position';
import { PlayerType } from 'models/player';
import { ICharacterData } from 'models/character-data';

export enum ActionID {
	ADD_CHARACTER = 'ADD_CHARACTER',
}

const add = (character: ICharacterData, player: PlayerType, position: Position): IAction => ({
	type: ActionID.ADD_CHARACTER,
	character,
	position,
	player
});

export default {
	add
};
