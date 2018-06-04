import uuid from 'uuid/v1';

import * as ArrayUtils from 'core/array';
import nameSamples from 'data/names';
import { IIndexable } from 'modules/indexable';

import { Jobs } from 'modules/job';
import RandomNameGenerator from 'core/random-name-generator';
import { ICharacterData, CharacterData } from 'modules/character-data';

// maximum character count in one party
const characterCount = 8;

// maximum character count of party name
const maxNameLength = 16;

export interface IParty extends IIndexable {
	readonly name: string;
	readonly characters: string[];  // list of character IDs
}

const create = (conf = {}): IParty => {
	const now = Date.now();
	const chars: string[] = [];

	const defaultParty: IParty = {
		id: uuid(),
		name: '',
		characters: chars,
		creationDate: now,
		lastUpdate: now
	};

	return Object.assign({}, defaultParty, conf);
};

// return character object from character list by its ID
const getCharacterById = (id: string, characters: ICharacterData[]): ICharacterData => {
	return characters.filter(char => char.id === id)[0];
};

// returns random character party array
const getRandomCharacters = (count: number): ICharacterData[] => {
	const characters = RandomNameGenerator.get(nameSamples, count, maxNameLength);
	const jobs = ArrayUtils.getRandomItems(Jobs.keys(), count);

	return characters.map((char, i) => CharacterData.random(char, jobs[i]));
};

const removeCharacter = (partyList: IParty[], char?: ICharacterData): IParty[] => {
	if (!char || !partyList.length) {
		return partyList;
	}
	const newPartyList: IParty[] = [];

	for (const party of partyList) {
		const newChars = party.characters.filter(charId => charId !== char.id);

		if (newChars.length) {
			newPartyList.push({
				...party,
				characters: newChars
			});
		}
	}
	return newPartyList;
};

const validate = (party: ICharacterData[] = []): string|true => {
	party = party.filter(char => !!char);

	if (!party.length) {
		return true;
	}
	const ids = party.map(char => char.id);
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
	const jobs = party.map(char => char.job);
	const jobErrs: { [job: string]: string[] } = {};
	let hasJobErrors = false;

	jobs.forEach((job, i) => {
		if (i !== jobs.lastIndexOf(job) && !jobErrs[job]) {
			const names = party
				.filter(char => job === char.job)
				.map(char => char.name);

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

export const Party = {
	characterCount,
	maxNameLength,
	create,
	getCharacterById,
	getRandomCharacters,
	removeCharacter,
	validate
};
