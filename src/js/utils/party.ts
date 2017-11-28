import getRandomNames from 'utils/random-name/generator';
import { getRandomArrayItems } from 'utils/array';

import { getRandomCharacter } from 'utils/character';
import { ICharacter } from 'models/character';
import { IParty } from 'models/party';
import { JobID } from 'models/job';
import Jobs from 'data/jobs';

// maximum character count in one party
export const characterCount: number = 8;

// maximum character count of party name
export const maxNameLength: number = 16;

// return character object from character list by its ID
export const getCharacterById = (id: string, characters: ICharacter[]): ICharacter => {
	return characters.filter((char: ICharacter) => char.id === id)[0];
};

// default party properties
export const getDefaultParty = (): IParty => ({
	name: '',
	characters: Array(characterCount).fill('')
});

// returns random character party
export const getRandomParty = (count: number): IParty => {
	const characters: string[] = getRandomNames(count, maxNameLength);
	const jobs: JobID[] = getRandomArrayItems(Object.keys(Jobs), count) as JobID[];

	const party: IParty = {
		name: 'Enemy Party',
		characters: characters.map((char, i) => getRandomCharacter(char, jobs[i]))
	};

	return party;
};
