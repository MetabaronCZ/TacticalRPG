import { IActionItem, IActions } from 'modules/character-action/types';
import { IMoveCostMap } from 'modules/pathfinding/movable';
import { ICharacter } from 'modules/character/types';
import { IPosition } from 'modules/position/types';
import { IPlayer } from 'modules/player/types';
import { IOrder } from 'modules/order/types';

export enum GamePhase {
	IDLE = 'IDLE',
	TICK = 'TICK',
	ACT = 'ACT',
	REACT = 'REACT'
}

export enum ActPhase {
	MOVE = 'MOVE',
	ACTION = 'ACTION',
	REACTION = 'REACTION',
	EVASION = 'EVASION',
	DIRECT = 'DIRECT',
	MOVE_ANIM = 'MOVE_ANIM',
	ACTION_ANIM = 'ACTION_ANIM'
}

export type IOnActionSelect = (action: IActionItem) => void;
export type IOnTileSelect = (pos: IPosition) => void;

export interface ISkillInfo {
	id: number;
	text: string;
	position: IPosition;
}

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
	readonly effectTargets?: string[]; // affected character IDs
}

interface IGameStateReact {
	readonly targets?: string[]; // reacting character IDs
	readonly evasionTarget?: IPosition; // selected evasion tile position
	readonly evasionArea?: IPosition[]; // possible evasion positions of reacting character
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
	readonly react: IGameStateReact;
	readonly direct: IGameStateDirect;
	readonly characters: ICharacter[];
	readonly ally: IPlayer;
	readonly enemy: IPlayer;
	readonly order: IOrder;
	readonly tick: number;
	readonly actors: string[]; // character ID array
	readonly skillInfo: ISkillInfo[];
}
