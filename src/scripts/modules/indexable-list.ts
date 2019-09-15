import { observable, action } from 'mobx';
import { IIndexableData } from 'modules/indexable-data';

class IndexableList<T extends IIndexableData> {
	@observable.shallow public data: T[] = [];

	constructor(data: T[] = []) {
		this.data = data;
	}

	public getById(id: string): T | null {
		return this.data.find(item => item.id === id) || null;
	}

	@action
	public add(item: T): void {
		this.data.push(item);
	}

	@action
	public replace(item: T): void {
		this.data = this.data.map(d => d.id === item.id ? item : d);
	}

	@action
	public moveDown(id: string): void {
		this.move(id, +1);
	}

	@action
	public moveUp(id: string): void {
		this.move(id, -1);
	}

	@action
	public remove(id: string): void {
		this.data = this.data.filter(ch => ch.id !== id);
	}

	public serialize(): T[] {
		return [...this.data];
	}

	private move(id: string, diff = 0): void {
		if (!diff) {
			return;
		}
		const { data } = this;
		const item = data.find(i => id === i.id);

		if (!item) {
			throw new Error(`Could not move item with ID "${id}"`);
		}
		const index = data.indexOf(item);

		if (index + diff < 0 || index + diff > data.length - 1) {
			return;
		}
		const curr = data[index];
		const next = data[index + diff];

		this.data = data.map((d, i) => {
			if (i === index) {
				return next;
			} else if (i === index + diff) {
				return curr;
			} else {
				return d;
			}
		});
	}
}

export default IndexableList;
