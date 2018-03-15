import { Position } from 'models/position';
import { ICharacter } from 'models/character';
import { PlayerType, IPlayer } from 'models/player';

export enum ActionID {
	GAME_START = 'GAME_START',
	GRID_SELECT = 'GRID_SELECT',
	ORDER_UPDATE = 'ORDER_UPDATE',
	CHARACTER_SELECT = 'CHARACTER_SELECT'
}

const gameStart = (ally: IPlayer, enemy: IPlayer, characters: ICharacter[], initiative: PlayerType) => ({
	type: ActionID.GAME_START,
	ally,
	enemy,
	characters,
	initiative
});

const orderUpdate = () => ({
	type: ActionID.ORDER_UPDATE
});

const characterSelect = (character: ICharacter) => ({
	type: ActionID.CHARACTER_SELECT,
	character
});

const gridSelect = (position: Position) => ({
	type: ActionID.GRID_SELECT,
	position
});

export default {
	gameStart,
	orderUpdate,
	gridSelect,
	characterSelect
};
