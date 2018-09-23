import { IndexableData } from 'engine/indexable-data';

// add item to state array
export const add = <T extends IndexableData, U extends T>(state: T[], item?: U): T[] => {
	return item ? state.concat(item) : state;
};

// remove item from state array
export const remove = <T extends IndexableData>(state: T[], value?: IndexableData): T[] => {
	if (!value) {
		return state;
	}
	return state.filter(item => value.id !== item.id);
};

// edit item in state array
export const edit = <T extends IndexableData, U extends T>(state: T[], value?: U): T[] => {
	if (!value) {
		return state;
	}
	return state.map(item => {
		if (value.id === item.id) {
			value.update();
			return value;
		}
		return item;
	});
};

// swap state array positions
export const swap = <T extends IndexableData>(state: T[], dir: number, value?: IndexableData): T[] => {
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
