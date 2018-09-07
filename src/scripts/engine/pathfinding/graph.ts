import Position from 'engine/position';

class Graph {
	private readonly items: Array<[Position, Position]> = [];

	public indexOf(from: Position): number|null {
		for (let i = 0, imax = this.items.length; i < imax; i++) {
			if (Position.isEqual(from, this.items[i][0])) {
				return i;
			}
		}
		return null;
	}

	public set(from: Position, to: Position) {
		const index = this.indexOf(from);

		if (null === index) {
			// add new item
			this.items.push([from, to]);
		} else {
			// update existing item
			this.items[index][1] = to;
		}
	}

	public get(from: Position): Position|null {
		const index = this.indexOf(from);

		if (null === index) {
			return null;
		}
		return this.items[index][1];
	}
}

export default Graph;
