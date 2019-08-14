import { gridSize } from 'data/game-config';

type IPosition = [number, number, number];

const max = gridSize - 1;

export const characterPositions: IPosition[][] = [
	// Player 0
	[
		[-3, -max + 3, max + 0],
		[-2, -max + 2, max + 0],
		[-1, -max + 1, max + 0],
		[+0, -max + 0, max + 0],
		[+1, -max + 0, max - 1],
		[+2, -max + 0, max - 2],
		[+3, -max + 0, max - 3],
		[+0, -max + 2, max - 2]
	],

	// Player 1
	[
		[-3, max + 0, -max + 3],
		[-2, max + 0, -max + 2],
		[-1, max + 0, -max + 1],
		[+0, max + 0, -max + 0],
		[+1, max - 1, -max + 0],
		[+2, max - 2, -max + 0],
		[+3, max - 3, -max + 0],
		[+0, max - 2, -max + 2]
	]
];
