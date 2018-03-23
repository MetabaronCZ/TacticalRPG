import { getRandomArrayItem } from 'utils/array';

type DataListIterator<T, U> = (key: T, value: U, i: number) => void;

class DataList<T, U> {
	private readonly items: Array<[T, U]> = [];

	constructor(items: Array<[T, U]> = []) {
		this.items = items;
	}

	public get size(): number {
		return this.items.length;
	}

	public has(key: T): boolean {
		return -1 !== this.indexOf(key);
	}

	public get(key: T): U {
		const index = this.indexOf(key);

		if (-1 === index) {
			throw new Error('DataList error: could not get a value with given key');
		}
		return this.items[index][1];
	}

	public set(key: T, value: U) {
		if (this.has(key)) {
			throw new Error('DataList error: value with given key already exists');
		}
		this.items.push([key, value]);
	}

	public delete(key: T) {
		const index = this.indexOf(key);

		if (-1 !== index) {
			this.items.splice(index, 1);
		}
	}

	public keys(): T[] {
		return this.items.map(entry => entry[0]);
	}

	public values(): U[] {
		return this.items.map(entry => entry[1]);
	}

	public entries(): Array<[T, U]> {
		return this.items.slice(0);
	}

	public map(cb: DataListIterator<T, U>): any[] {
		return this.items.map(([key, value], i) => cb(key, value, i));
	}

	public each(cb: DataListIterator<T, U>) {
		return this.items.forEach(([key, value], i) => cb(key, value, i));
	}

	public getRandomKey(): T {
		return getRandomArrayItem(this.items)[0];
	}

	public getRandomValue(): U {
		return getRandomArrayItem(this.items)[1];
	}

	protected filterFn(cb: DataListIterator<T, U>): DataList<T, U> {
		const entries = this.items.filter(([key, value], i) => cb(key, value, i));
		return new DataList<T, U>(entries);
	}

	protected indexOf(key: T): number {
		for (const entry of this.items) {
			if (key === entry[0]) {
				return this.items.indexOf(entry);
			}
		}
		return -1;
	}
}

export default DataList;
