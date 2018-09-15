import { PlayerControlID } from 'engine/player-control';

export interface IBattleConfigPlayer {
	name: string;
	control: PlayerControlID;
	party: string;
}

export interface IBattleConfig {
	players: IBattleConfigPlayer[];
}
