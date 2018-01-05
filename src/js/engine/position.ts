class Position {
	private readonly x: number;
	private readonly y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	public getX(): number {
		return this.x;
	}

	public getY(): number {
		return this.y;
	}
}

export default Position;
