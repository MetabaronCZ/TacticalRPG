export interface IPosition {
	x: number;
	y: number;
}

export class Position {
	public static create(x: number = 0, y: number = 0): IPosition {
		return { x, y };
	}
}
