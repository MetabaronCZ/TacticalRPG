export enum PlayerType {
	ALLY = 'ALLY',
	ENEMY = 'ENEMY'
}

export interface IPlayer {
	readonly name: string;
	readonly type: PlayerType;
}

const create = (name: string, type: PlayerType) => ({
	name,
	type
});

export const Player = {
	create
};
