// return array of random items from given array
export const getRandomItems = <T>(arr: T[], count = 1): T[] => {
	const res = [];
	arr = arr.slice(0);

	while (count && arr.length) {
		const ran = Math.floor(Math.random() * arr.length);
		res.push( arr.splice(ran, 1)[0] );
		count--;
	}

	return res;
};

// return random array item
export const getRandomItem = <T>(arr: T[]): T => {
	return getRandomItems(arr, 1)[0];
};

// return randomized array
export const randomize = <T>(arr: T[]): T[] => {
	const randomized: T[] = [];
	const copy = arr.slice(0);

	while (copy.length) {
		const item = getRandomItem(copy);
		const i = copy.indexOf(item);
		randomized.push(item);
		copy.splice(i, 1);
	}
	return randomized;
};

// return union of multiple arrays
export const getUnion = <T>(arrays: T[][]): T[] => {
	if (!arrays.length) {
		return [];
	}
	if (1 === arrays.length) {
		return arrays[0].slice(0);
	}
	const union: T[] = [];

	for (const arr of arrays) {
		for (const a of arr) {
			if (-1 === union.indexOf(a)) {
				union.push(a);
			}
		}
	}
	return union;
};

// return intersection of multiple arrays
export const getIntersection = <T>(arrays: T[][], getId: (value: T) => string): T[] => {
	if (!arrays.length) {
		return [];
	}
	if (1 === arrays.length) {
		return arrays[0].slice(0);
	}
	const ref: { [id: string]: [number, T] } = {};
	const intersection: T[] = [];

	for (const arr of arrays) {
		for (const a of arr) {
			const id = getId(a);
			ref[id] = ref[id] || [0, a];
			ref[id][0]++;
		}
	}

	for (const r in ref) {
		const [count, value] = ref[r];

		if (count === arrays.length) {
			intersection.push(value);
		}
	}
	return intersection;
};
