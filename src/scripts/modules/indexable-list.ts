import { observable, action } from 'mobx';
import { IndexableData, IIndexableData } from 'modules/indexable-data';

class IndexableList<T extends IndexableData> {
	@observable.shallow public data: T[] = [];

	constructor(data: T[] = []) {
		this.data = data;
	}

	public getById(id: string): T | null {
		return this.data.find(item => item.id === id) || null;
	}

	@action
	public add(item: T) {
		this.data.push(item);
	}

	@action
	public replace(item: T) {
		this.data = this.data.map(d => d.id === item.id ? item : d);
	}

	@action
	public moveDown(item: T) {
		this.move(item, +1);
	}

	@action
	public moveUp(item: T) {
		this.move(item, -1);
	}

	@action
	public remove(item: T) {
		this.data = this.data.filter(ch => ch.id !== item.id);
	}

	public serialize(): IIndexableData[] {
		return this.data.map(item => item.serialize());
	}

	private move(item: T, diff = 0) {
		if (!diff) {
			return;
		}
		const data = this.data;
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
