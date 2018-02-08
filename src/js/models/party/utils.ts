import uuid from 'uuid';

import { getRandomArrayItems } from 'utils/array';
import { getRandomCharacter } from 'models/character/utils';
import { getRandomNames } from 'models/random-name-generator';

import { Jobs } from 'models/job';
import { IPartyData } from 'models/party';
import { ICharacterData } from 'models/character';

// maximum character count in one party
export const characterCount = 8;

// maximum character count of party name
export const maxNameLength = 16;

// return character object from character list by its ID
export const getCharacterById = (id: string, characters: ICharacterData[]): ICharacterData => {
	return characters.filter((char) => char.id === id)[0];
};

// returns random character party array
export const getRandomPartyCharacters = (count: number): ICharacterData[] => {
	const characters = getRandomNames(count, maxNameLength);
	const jobs = getRandomArrayItems(Jobs.keys(), count);

	return characters.map((char, i) => getRandomCharacter(char, jobs[i]));
};

export const makeParty = ({
	name = '',
	id = uuid(),
	creationDate = 0,
	lastUpdate = 0,
	characters = []
}): IPartyData => {
	const now = Date.now();

	return {
		name,
		id,
		creationDate: creationDate || now,
		lastUpdate: lastUpdate || now,
		characters
	};
};
