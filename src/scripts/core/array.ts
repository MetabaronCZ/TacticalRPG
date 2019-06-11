import { randomNumberBetween } from 'core/number';

// return array of unique items
export const getUniqueItems = <T>(arr: T[]): T[] => {
	const unique = new Set(arr);
	return Array.from(unique);
};

// return random array item
export const getRandomItem = <T>(arr: T[]): T | null => {
	if (!arr.length) {
		return null;
	}
	const index = randomNumberBetween(0, arr.length - 1);
	return arr[index];
};

// return randomized array
export const getRandomized = <T>(arr: T[]): T[] => {
	const copy = arr.slice(0);
	const result: T[] = [];

	while (copy.length) {
		const index = randomNumberBetween(0, copy.length - 1);
		result.push(copy[index]);
		copy.splice(index, 1);
	}
	return result;
};

// return intersection of multiple arrays
export const getIntersection = <T>(arrays: T[][]): T[] => {
	const len = arrays.length;

	if (0 === len) {
		return [];
	}
	if (1 === len) {
		return arrays[0].slice(0);
	}
	const items = arrays.reduce((a, b) => a.concat(b));
	const unique = getUniqueItems(items);
	const result: T[] = [];

	for (const item of unique) {
		const counts = arrays.map(arr => arr.filter(i => i === item).length);
		let commonCount = counts.reduce((a, b) => a < b ? a : b);

		while (commonCount) {
			result.push(item);
			commonCount--;
		}
	}
	return result;
};
