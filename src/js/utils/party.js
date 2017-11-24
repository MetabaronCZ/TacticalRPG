import getRandomNames from 'utils/random-name/generator';
import { getRandomArrayItems } from 'utils/array';

import { getRandomCharacter } from 'utils/character';
import Jobs from 'data/jobs';

// maximum character count in one party
export const characterCount = 8;

// maximum character count of party name
export const maxNameLength = 16;

// return character object from character list by its ID
export const getCharacterById = (id, characters) => {
	return characters.filter(char => char.id === id)[0];
};

// default party properties
export const getDefaultParty = () => ({
	name: '',
	characters: Array(characterCount).fill('')
});

// returns random character party
export const getRandomParty = count => {
	let characters = getRandomNames(count, maxNameLength);
	let jobs = getRandomArrayItems(Object.keys(Jobs), count);

	let party = {
		name: 'Enemy Party',
		characters: characters.map((char, i) => getRandomCharacter(char, jobs[i]))
	};

	return party;
};
