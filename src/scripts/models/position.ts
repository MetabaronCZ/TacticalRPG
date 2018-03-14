export class Position {
	private readonly posX: number;
	private readonly posY: number;

	constructor(x: number = 0, y: number = 0) {
		this.posX = x;
		this.posY = y;
	}

	public get x(): number {
		return this.posX;
	}

	public get y(): number {
		return this.posY;
	}
}
