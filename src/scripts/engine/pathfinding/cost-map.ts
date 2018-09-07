import Position from 'engine/position';

class CostMap {
	private readonly items: Array<[Position, number]> = [];

	public indexOf(position: Position): number|null {
		for (let i = 0, imax = this.items.length; i < imax; i++) {
			if (Position.isEqual(position, this.items[i][0])) {
				return i;
			}
		}
		return null;
	}

	public set(position: Position, cost: number) {
		const index = this.indexOf(position);

		if (null === index) {
			// add new item
			this.items.push([position, cost]);
		} else {
			// update existing item
			this.items[index][1] = cost;
		}
	}

	public get(position: Position): number {
		const index = this.indexOf(position);

		if (null === index) {
			return 0;
		}
		return this.items[index][1];
	}
}

export default CostMap;
