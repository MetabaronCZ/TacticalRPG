// random name generator (Markov chains order)
const markovOrder = 3;

import samples from 'utils/random-name/samples';

const createGraph = (dict, order) => {
	let starters = [];
	let finishers = {};
	let groups = {};
	let graph;

	order = (order && order > 0) ? order : 1;

	for ( let sample of dict ){
		if ( sample.length < order ){
			if ( !groups[sample] ){
				groups[sample] = {
					count: 0,
					next: {
						'END': { count: 0 }
					}
				};
			}
			groups[sample].count++;
			groups[sample].next['END'].count++;
			continue;
		}
		finishers[sample.substring(sample.length - order)] = true;

		for ( let i = 0, imax = sample.length - order + 1; i < imax; i++ ){
			let group = sample.substring(i, i + order),
				next = sample[i + order] || 'END';

			if ( !groups[group] ){
				groups[group] = {
					count: 0,
					next: {}
				};

				if ( !i ){
					starters.push(group);
				}
			}
			groups[group].count++;

			if ( !groups[group].next[next] ){
				groups[group].next[next] = {
					count: 0
				};
			}
			groups[group].next[next].count++;
		}
	}

	// create graph object
	graph = {
		groups: groups,
		starters: starters,
		finishers: finishers
	};

	// assign occurence weights of next letters of each group
	setWeights(graph);

	return graph;
};

const setWeights = graph => {
	for ( let group in graph.groups ){
		for ( let letter in graph.groups[group].next ){
			let node = graph.groups[group].next[letter];
			node.weight = node.count / graph.groups[group].count;
		}
	}
};

const getRandomStarter = graph => {
	let starters = graph.starters;
	let random = Math.random();

	return starters[ Math.floor(starters.length*random) ];
};

const getNextLetter = (graph, group) => {
	let random = Math.random();
	let node = graph.groups[group];
	let weight = 0;
	let list = [];

	if ( !node ){
		return '';
	}

	// convert data structure to array
	for ( let next in node.next ){
		list.push({
			name: next,
			weight: node.next[next].weight
		});
	}

	// sort data from most "occurate" group
	list = list.sort((a, b) => b.weight - a.weight);

	for ( let letter of list ){
		weight += letter.weight;

		if ( random <= weight ){
			return ('END' === letter.name) ? '' : letter.name;
		}
	}
};

const getRandomName = (graph, maxlength) => {
	let name = getRandomStarter(graph);
	let order = name.length;

	maxlength = (maxlength && maxlength > order) ? maxlength : order;
	maxlength -= order;

	while ( maxlength-- ){
		let letter = getNextLetter(graph, name.substring(name.length - order));

		if ( !letter ){
			break;
		}
		name += letter;

		if ( name.length > order + 1 && graph.finishers[name.substring(name.length - order)] ){
			break;
		}
	}
	return name[0] + name.substring(1).toLowerCase();
};

const getRandomNames = (count, maxlength) => {
	let graph = createGraph(samples, markovOrder);
	let names = [];

	while ( count-- ){
		names.push( getRandomName(graph, maxlength) );
	}
	return names;
};

export default getRandomNames;
