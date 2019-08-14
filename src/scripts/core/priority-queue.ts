class PriorityQueue<T> {
	private values: Array<[number, T]> = [];

	public size(): number {
		return this.values.length;
	}

	public push(value: T, priority: number): void {
		const values = this.values;
		const size = this.size();

		if (0 === size) {
			values.push([priority, value]);
			return;
		}

		for (let i = size - 1; i >= 0; i--) {
			const lastValue = values[i];

			if (lastValue[0] <= priority) {
				values.splice(i + 1, 0, [priority, value]);
				return;
			}
		}
		values.unshift([priority, value]);
	}

	public get(): T | undefined {
		const value = this.values.shift();
		return value ? value[1] : undefined;
	}
}

export default PriorityQueue;
