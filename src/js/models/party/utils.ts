import uuid from 'uuid/v1';

import { getRandomArrayItems } from 'utils/array';
import { getRandomCharacter } from 'models/character/utils';
import getRandomNames from 'models/random-name-generator';

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

interface IPartyConfig {
	name?: string;
	id?: string;
	creationDate?: number;
	lastUpdate?: number;
	characters?: string[]; // list of character IDs
}

export const makeParty = (conf: IPartyConfig = {}): IPartyData => {
	const now = Date.now();

	return {
		name: conf.name || '',
		id: conf.id || uuid(),
		creationDate: conf.creationDate || now,
		lastUpdate: conf.lastUpdate || now,
		characters: conf.characters || []
	};
};

export const validateParty = (party?: ICharacterData[]): string|true => {
	if (!party || !party.length) {
		return 'Party contains no characters';
	}
	const ids = party.map((char) => char.id);
	const idErrs: string[] = [];

	ids.forEach((id, i) => {
		const name = party[i].name;

		if (i !== ids.lastIndexOf(id) && -1 === idErrs.indexOf(name)) {
			idErrs.push(name);
		}
	});

	if (idErrs.length) {
		return `Party contains same character multiple times: ${idErrs.join(', ')}`;
	}
	const jobs = party.map((char) => char.job);
	const jobErrs: { [job: string]: string[] } = {};
	let hasJobErrors = false;

	jobs.forEach((job, i) => {
		if (i !== jobs.lastIndexOf(job) && !jobErrs[job]) {
			const names = party.filter((char) => job === char.job).map((char) => char.name);
			jobErrs[job] = names;
			hasJobErrors = true;
		}
	});

	if (hasJobErrors) {
		const msg = [];

		for (const err in jobErrs) {
			msg.push(`${err} (${jobErrs[err].join(', ')})`);
		}
		return `Party contains same job multiple times: ${msg.join(', ')}`;
	}

	// party is valid
	return true;
};
