import uuid from 'uuid/v1';

export interface IIndexable {
	readonly id: string;
	readonly creationDate: number;
	readonly lastUpdate: number;
}

// swap state array positions
export const swap = <T extends IIndexable>(state: T[], dir: number, value?: IIndexable): T[] => {
	if (!value) {
		return state;
	}
	const index = state.findIndex(item => value.id === item.id);

	if (index + dir < 0 || index + dir > state.length - 1) {
		return state;
	}
	const curr = state[index];
	const next = state[index + dir];

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
export const add = <T extends IIndexable>(state: T[], item: any): T[] => {
	const now = Date.now();

	return state.concat({
		...item,
		id: uuid(),
		creationDate: now,
		lastUpdate: now
	});
};

// remove item from state array
export const remove = <T extends IIndexable>(state: T[], value?: IIndexable): T[] => {
	if (!value) {
		return state;
	}
	return state.filter(item => value.id !== item.id);
};

// edit item in state array
export const edit = <T extends IIndexable>(state: T[], value?: any): T[] => {
	if (!value) {
		return state;
	}
	const now = Date.now();

	return state.map((item: any) => {
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
