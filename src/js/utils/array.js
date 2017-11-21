import uuid from 'uuid/v1';

// swap state array positions
export const swap = (id, dir, state) => {
	let index = state.findIndex(item => id === item.id);

	if ( index + dir < 0 || index + dir > state.length - 1 ){
		return state;
	}
	let curr = state[index];
	let next = state[index + dir];

	return state.map((item, i) => {
		if ( i === index ){
			return next;
		} else if ( i === index + dir ){
			return curr;
		} else {
			return item;
		}
	});
};

// add item to state array
export const add = (item, state) => {
	let now = Date.now();

	return state.concat({
		...item,
		id: uuid(),
		creationDate: now,
		lastUpdate: now
	});
};

// remove item from state array
export const remove = (id, state) => state.filter(item => id !== item.id);

// edit item in state array
export const edit = (value, state) => {
	let now = Date.now();

	return state.map(item => {
		if ( value.id === item.id ){
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
export const getRandomArrayItems = (arr, count = 1) => {
	let res = [];
	arr = arr.slice(0);

	while ( count && arr.length ){
		let ran = Math.floor( Math.random()*arr.length );
		res.push( arr.splice(ran, 1)[0] );
		count--;
	}

	return res;
};

// return random array item
export const getRandomArrayItem = arr => getRandomArrayItems(arr, 1)[0];
