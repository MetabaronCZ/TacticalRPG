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
	readonly phase: ActPhase;
	readonly action?: IActionItem;
	readonly actionMenu?: IActions;
	readonly initAP?: number; // actor's AP on turn start
}

interface IGameStateMove {
	readonly origin?: IPosition; // actor start position
	readonly costMap?: IMoveCostMap; // movable area cost map
	readonly target?: IPosition; // target position
	readonly area?: IPosition[]; // movable tiles
	readonly path?: IPosition[]; // move path
}

interface IGameStateSkill {
	readonly targetArea?: IPosition[]; // skill range tiles
	readonly targets?: IPosition[]; // targetable tiles
	readonly effectArea?: IPosition[]; // effect area
	readonly effectTarget?: IPosition; // selected skill target
	readonly effectTargets?: IPosition[]; // affected targets
}

interface IGameStateDirect {
	readonly area?: IPosition[]; // positions character can be aligned to
	readonly target?: IPosition; // position character is directed to
}

export interface IGameState {
	readonly phase: GamePhase;
	readonly act: IGameStateAct;
	readonly move: IGameStateMove;
	readonly skill: IGameStateSkill;
	readonly direct: IGameStateDirect;
	readonly characters: ICharacter[];
	readonly ally: IPlayer;
	readonly enemy: IPlayer;
	readonly order: IOrder;
	readonly tick: number;
	readonly actors: string[]; // character ID array
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
