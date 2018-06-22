// return array of random items from given array
export const getRandomMapItems = <T, K>(map: Map<T, K>, count = 1): T[] => {
	const res = [];
	const temp = new Map<T, K>(map);

	while (count && map.size) {
		const ran = Math.floor(Math.random() * map.size);
		const key = Array.from(temp.keys())[ran];
		temp.delete(key);
		res.push(key);
		count--;
	}

	return res;
};

// return random Map item
export const getRandomMapItem = <T, K>(map: Map<T, K>): T => {
	return getRandomMapItems(map, 1)[0];
};
