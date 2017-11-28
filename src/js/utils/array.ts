import uuid from 'uuid/v1';

export interface IIndexable {
	readonly id: string;
	creationDate: number;
	lastUpdate: number;
}

// swap state array positions
export const swap = (id: string, dir: number, state: IIndexable[]): IIndexable[] => {
	const index: number = state.findIndex((item: IIndexable) => id === item.id);

	if (index + dir < 0 || index + dir > state.length - 1) {
		return state;
	}
	const curr: IIndexable = state[index];
	const next: IIndexable = state[index + dir];

	return state.map((item, i) => {
		if (i === index) {
			return next;
		} else if (i === index + dir) {
			return curr;
		} else {
			return item;
		}
	});
};

// add item to state array
export const add = (item: {}, state: IIndexable[]): IIndexable[] => {
	const now: number = Date.now();

	return state.concat({
		...item,
		id: uuid(),
		creationDate: now,
		lastUpdate: now
	});
};

// remove item from state array
export const remove = (id: string, state: IIndexable[]): IIndexable[] => {
	return state.filter((item: IIndexable) => id !== item.id);
};

// edit item in state array
export const edit = (value: any, state: IIndexable[]): IIndexable[] => {
	const now: number = Date.now();

	return state.map((item: IIndexable) => {
		if (value.id === item.id) {
			return {
				...item,
				...value,
				lastUpdate: now
			};
		}
		return item;
	});
};

// return array of random items from given array
export const getRandomArrayItems = <T>(arr: T[], count: number = 1): T[] => {
	const res: T[] = [];
	arr = arr.slice(0);

	while (count && arr.length) {
		const ran = Math.floor(Math.random() * arr.length);
		res.push( arr.splice(ran, 1)[0] );
		count--;
	}

	return res;
};

// return random array item
export const getRandomArrayItem = <T>(arr: T[]): T => {
	return getRandomArrayItems(arr, 1)[0];
};
