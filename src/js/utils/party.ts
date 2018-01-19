import uuid from 'uuid';

import getRandomNames from 'utils/random-name/generator';
import { getRandomArrayItems } from 'utils/array';

import { getRandomCharacter } from 'utils/character';
import { ICharacter } from 'models/character';
import { IParty } from 'models/party';
import { JobID } from 'models/job';
import JobList from 'data/job-list';

// maximum character count in one party
export const characterCount = 8;

// maximum character count of party name
export const maxNameLength = 16;

// return character object from character list by its ID
export const getCharacterById = (id: string, characters: ICharacter[]): ICharacter => {
	return characters.filter((char) => char.id === id)[0];
};

// returns random character party array
export const getRandomPartyCharacters = (count: number): ICharacter[] => {
	const characters = getRandomNames(count, maxNameLength);
	const jobs = getRandomArrayItems(Object.keys(JobList), count) as JobID[];

	return characters.map((char, i) => getRandomCharacter(char, jobs[i]));
};

interface IDefaultPartyData {
	name?: string;
	id?: string;
	creationDate?: number;
	lastUpdate?: number;
	characters?: string[];
}

export const makeParty = ({
	name = '',
	id = uuid(),
	creationDate,
	lastUpdate,
	characters = []
}: IDefaultPartyData): IParty => {
	const now = Date.now();

	return {
		name,
		id,
		creationDate: creationDate || now,
		lastUpdate: lastUpdate || now,
		characters
	};
};
