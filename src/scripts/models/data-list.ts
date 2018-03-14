import { getRandomArrayItem } from 'utils/array';

type DataListIterator<T, U> = (key: T, value: U, i: number) => void;

class DataList<T, U> {
	private readonly entries: Array<[T, U]> = [];

	constructor(entries: Array<[T, U]> = []) {
		this.entries = entries;
	}

	public get size(): number {
		return this.entries.length;
	}

	public has(key: T): boolean {
		return -1 !== this.indexOf(key);
	}

	public get(key: T): U {
		const index = this.indexOf(key);

		if (-1 === index) {
			throw new Error('DataList error: could not get a value with given key');
		}
		return this.entries[index][1];
	}

	public set(key: T, value: U) {
		if (this.has(key)) {
			throw new Error('DataList error: value with given key already exists');
		}
		this.entries.push([key, value]);
	}

	public delete(key: T) {
		const index = this.indexOf(key);

		if (-1 !== index) {
			this.entries.splice(index, 1);
		}
	}

	public keys(): T[] {
		return this.entries.map(entry => entry[0]);
	}

	public values(): U[] {
		return this.entries.map(entry => entry[1]);
	}

	public map(cb: DataListIterator<T, U>): any[] {
		return this.entries.map(([key, value], i) => cb(key, value, i));
	}

	public each(cb: DataListIterator<T, U>) {
		return this.entries.forEach(([key, value], i) => cb(key, value, i));
	}

	public getRandomKey(): T {
		return getRandomArrayItem(this.entries)[0];
	}

	public getRandomValue(): U {
		return getRandomArrayItem(this.entries)[1];
	}

	protected filterFn(cb: DataListIterator<T, U>): DataList<T, U> {
		const entries = this.entries.filter(([key, value], i) => cb(key, value, i));
		return new DataList<T, U>(entries);
	}

	protected indexOf(key: T): number {
		for (const entry of this.entries) {
			if (key === entry[0]) {
				return this.entries.indexOf(entry);
			}
		}
		return -1;
	}
}

export default DataList;
