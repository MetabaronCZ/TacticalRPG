export enum PlayerType {
	ALLY = 'ALLY',
	ENEMY = 'ENEMY'
}

export interface IPlayer {
	readonly name: string;
	readonly type: PlayerType;
}
