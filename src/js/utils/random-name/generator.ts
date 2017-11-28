// random name generator (Markov chains order)
import samples from 'utils/random-name/samples';

const markovOrder: number = 3;
const paramEnd: string = 'END';

interface IGroup {
	count: number;
	readonly next: any;
}

interface IGroups {
	[name: string]: IGroup;
}

interface IFinishers {
	[sample: string]: boolean;
}

interface IGraph {
	groups: IGroups;
	starters: string[];
	finishers: IFinishers;
}

interface ILetterItem {
	name: string;
	weight: number;
}

const createGraph = (dict: string[], order: number): IGraph => {
	const starters: string[] = [];
	const groups: IGroups = {};
	const finishers: IFinishers = {};
	let graph: IGraph;

	order = (order && order > 0) ? order : 1;

	for (const sample of dict) {
		if (sample.length < order) {
			if (!groups[sample]) {
				groups[sample] = {
					count: 0,
					next: {
						[paramEnd]: { count: 0 }
					}
				};
			}
			groups[sample].count++;
			groups[sample].next[paramEnd].count++;
			continue;
		}
		finishers[sample.substring(sample.length - order)] = true;

		for (let i = 0, imax = sample.length - order + 1; i < imax; i++) {
			const group: string = sample.substring(i, i + order);
			const next: string = sample[i + order] || paramEnd;

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
					count: 0
				};
			}
			groups[group].next[next].count++;
		}
	}

	// create graph object
	graph = { groups, starters, finishers };

	// assign occurence weights of next letters of each group
	setWeights(graph);

	return graph;
};

const setWeights = (graph: IGraph): void => {
	for (const group in graph.groups) {
		for (const letter in graph.groups[group].next) {
			const node = graph.groups[group].next[letter];
			node.weight = node.count / graph.groups[group].count;
		}
	}
};

const getRandomStarter = (graph: IGraph): string => {
	const starters: string[] = graph.starters;
	const random: number = Math.random();

	return starters[Math.floor(starters.length * random)];
};

const getNextLetter = (graph: IGraph, groupName: string): string => {
	const random: number = Math.random();
	const node: IGroup = graph.groups[groupName];
	let weight: number = 0;
	let list: ILetterItem[] = [];

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

const getRandomName = (graph: IGraph, maxlength: number): string => {
	let name: string = getRandomStarter(graph);
	const order: number = name.length;

	maxlength = (maxlength && maxlength > order) ? maxlength : order;
	maxlength -= order;

	while (maxlength--) {
		const letter: string = getNextLetter(graph, name.substring(name.length - order));

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

const getRandomNames = (count: number, maxlength: number): string[] => {
	const graph: IGraph = createGraph(samples, markovOrder);
	const names: string[] = [];

	while (count--) {
		names.push( getRandomName(graph, maxlength) );
	}
	return names;
};

export default getRandomNames;
