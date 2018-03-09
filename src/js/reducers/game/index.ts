import { combineReducers } from 'redux';

import { IOrder } from 'models/order';
import { IRound } from 'models/round';
import { IPlayer } from 'models/player';
import { ICharacter } from 'models/character';

import players from 'reducers/game/players';
import characters from 'reducers/game/characters';
import order from 'reducers/game/order';
import round, { initialState as defaultRound } from 'reducers/game/round';

export interface IGameState {
	characters: ICharacter[];
	players: IPlayer[];
	order: IOrder;
	round: IRound;
	selected?: Position;
}

export const defaultGameState = {
	characters: [],
	players: [],
	order: [],
	round: defaultRound
};

export default combineReducers<IGameState>({
	characters,
	players,
	order,
	round
});
