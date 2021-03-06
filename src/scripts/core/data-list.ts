type DataListIterator<T, U, V> = (key: T, value: U, i: number) => V;

type IDataList<T extends string, U> = {
	[k in T]: U;
};

class DataList<T extends string, U> {
	private readonly data: IDataList<T, U>;

	constructor(data: IDataList<T, U>) {
		this.data = data;
	}

	public get(item: T): U {
		return this.data[item];
	}

	public keys(): T[] {
		return Object.keys(this.data) as T[];
	}

	public values(): U[] {
		return this.keys().map(id => this.get(id));
	}

	public entries(): Array<[T, U]> {
		return this.keys().map(key => [key, this.get(key)] as [T, U]);
	}

	public map<V>(cb: DataListIterator<T, U, V>): V[] {
		return this.entries().map(([key, value], i) => cb(key, value, i));
	}

	public each(cb: DataListIterator<T, U, void>): void {
		this.entries().forEach(([key, value], i) => cb(key, value, i));
	}

	public filter(cb: DataListIterator<T, U, boolean>): Array<[T, U]> {
		return this.entries().filter(([key, value], i) => cb(key, value, i));
	}
}

export default DataList;
