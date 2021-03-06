import nameSamples from 'data/names';

const markovOrder = 3; // Markov chains order
const paramEnd = 'END';

interface INextItem {
	[id: string]: {
		count: number;
		weight: number;
	};
}

interface IGroups {
	[name: string]: {
		count: number;
		readonly next: INextItem;
	};
}

interface IFinishers {
	[sample: string]: boolean;
}

interface IGraph {
	readonly groups: IGroups;
	readonly starters: string[];
	readonly finishers: IFinishers;
}

const getRandomStarter = (graph: IGraph): string => {
	const starters = graph.starters;
	const random = Math.random();

	return starters[Math.floor(starters.length * random)];
};

const getNextLetter = (graph: IGraph, groupName: string): string => {
	const node = graph.groups[groupName];
	const random = Math.random();
	let weight = 0;
	let list = [];

	if (!node) {
		return '';
	}

	// convert data structure to array
	for (const next in node.next) {
		list.push({
			name: next,
			weight: node.next[next].weight
		});
	}

	// sort data from most "occurate" group
	list = list.sort((a, b) => b.weight - a.weight);

	for (const letter of list) {
		weight += letter.weight;

		if (random <= weight) {
			return (paramEnd === letter.name) ? '' : letter.name;
		}
	}

	return '';
};

const setWeights = (graph: IGraph): void => {
	for (const group in graph.groups) {
		for (const letter in graph.groups[group].next) {
			const node = graph.groups[group].next[letter];
			node.weight = node.count / graph.groups[group].count;
		}
	}
};

const getRandom = (graph: IGraph, maxlength: number): string => {
	let name = getRandomStarter(graph);
	const order = name.length;

	maxlength = (maxlength && maxlength > order) ? maxlength : order;
	maxlength -= order;

	while (maxlength--) {
		const letter = getNextLetter(graph, name.substring(name.length - order));

		if (!letter) {
			break;
		}
		name += letter;

		if (name.length > order + 1 && graph.finishers[name.substring(name.length - order)]) {
			break;
		}
	}
	return name[0] + name.substring(1).toLowerCase();
};

const createGraph = (dict: string[], order: number): IGraph => {
	const finishers: IFinishers = {};
	const groups: IGroups = {};
	const starters = [];

	order = (order && order > 0) ? order : 1;

	for (const sample of dict) {
		if (sample.length < order) {
			if (!groups[sample]) {
				groups[sample] = {
					count: 0,
					next: {
						[paramEnd]: {
							count: 0,
							weight: 0
						}
					}
				};
			}
			groups[sample].count++;
			groups[sample].next[paramEnd].count++;
			continue;
		}
		finishers[sample.substring(sample.length - order)] = true;

		for (let i = 0, imax = sample.length - order + 1; i < imax; i++) {
			const group = sample.substring(i, i + order);
			const next = sample[i + order] || paramEnd;

			if (!groups[group]) {
				groups[group] = {
					count: 0,
					next: {}
				};

				if (!i) {
					starters.push(group);
				}
			}
			groups[group].count++;

			if (!groups[group].next[next]) {
				groups[group].next[next] = {
					count: 0,
					weight: 0
				};
			}
			groups[group].next[next].count++;
		}
	}

	// create graph object
	const graph: IGraph = { groups, starters, finishers };

	// assign occurence weights of next letters of each group
	setWeights(graph);

	return graph;
};

export const getRandomNames = (count: number, maxlength: number): string[] => {
	const graph = createGraph(nameSamples, markovOrder);
	const names = [];

	while (count--) {
		names.push(getRandom(graph, maxlength));
	}
	return names;
};
