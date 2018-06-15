import { gridSize, enemyPlayerName, allyPlayerName } from 'data/game-config';

import { IActionItem, IActions } from 'modules/character-action';
import { IPlayer, Player, PlayerType } from 'modules/player';
import { IMoveCostMap } from 'modules/pathfinding/movable';
import { ICharacter, Character } from 'modules/character';
import { ICharacterData } from 'modules/character-data';
import { IPosition, Position } from 'modules/position';
import { IOrder, Order } from 'modules/order';
import { Direction } from 'modules/direction';
import { Party } from 'modules/party';

export enum GamePhase {
	IDLE = 'IDLE',
	TICK = 'TICK',
	ACT = 'ACT',
	REACT = 'REACT'
}

export enum ActPhase {
	MOVE = 'MOVE',
	ACTION = 'ACTION',
	DIRECT = 'DIRECT',
	MOVE_ANIM = 'MOVE_ANIM',
	ACTION_ANIM = 'ACTION_ANIM'
}

export type IOnActionSelect = (action: IActionItem) => void;
export type IOnTileSelect = (pos: IPosition) => void;

interface IGameStateAct {
	phase: ActPhase;
	action?: IActionItem;
	actionMenu?: IActions;
	initAP?: number; // actor's AP on turn start
}

interface IGameStateMove {
	origin?: IPosition; // actor start position
	costMap?: IMoveCostMap; // movable area cost map
	target?: IPosition; // target position
	area?: IPosition[]; // movable tiles
	path?: IPosition[]; // move path
}

interface IGameStateSkill {
	targetArea?: IPosition[]; // skill range tiles
	targets?: IPosition[]; // targetable tiles
	effectArea?: IPosition[]; // effect area
	effectTarget?: IPosition; // selected skill target
	effectTargets?: IPosition[]; // affected targets
}

interface IGameStateDirect {
	area?: IPosition[]; // positions character can be aligned to
	target?: IPosition; // position character is directed to
}

export interface IGameState {
	phase: GamePhase;
	act: IGameStateAct;
	move: IGameStateMove;
	skill: IGameStateSkill;
	direct: IGameStateDirect;
	characters: ICharacter[];
	ally: IPlayer;
	enemy: IPlayer;
	order: IOrder;
	tick: number;
	actors: string[]; // character ID array
}

export const getInitialState = (charIds: string[], chars: ICharacterData[], initiative: PlayerType): IGameState => {
	const party = charIds
		.filter(id => !!id)
		.map(id => Party.getCharacterById(id, chars));

	const ally = Player.create(allyPlayerName, PlayerType.ALLY);
	const enemy = Player.create(enemyPlayerName, PlayerType.ENEMY);

	const allies = party.map((char, i) => {
		return Character.create(char, Position.create(i + 2, gridSize - 1), Direction.TOP, PlayerType.ALLY);
	});

	const enemies = Party.getRandomCharacters(party.length)
		.map((char, i) => {
			return Character.create(char, Position.create(i + 2, 0), Direction.BOTTOM, PlayerType.ENEMY);
		});

	const characters = allies.concat(enemies);
	const order = Order.get(characters, initiative);

	return {
		phase: GamePhase.IDLE,
		tick: 0,
		actors: [],
		ally,
		enemy,
		characters,
		order,
		act: {
			phase: ActPhase.MOVE
		},
		move: {},
		skill: {},
		direct: {}
	};
};
