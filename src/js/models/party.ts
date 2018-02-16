import uuid from 'uuid/v1';

import { Jobs } from 'models/job';
import { getRandomNames } from 'models/random-name-generator';
import { ICharacterData, CharacterData } from 'models/character-data';
import { IIndexable, getRandomArrayItems } from 'utils/array';

export interface IPartyData extends IIndexable {
	name: string;
	characters: string[];
}

export class Party {
	// maximum character count in one party
	public static characterCount = 8;

	// maximum character count of party name
	public static maxNameLength = 16;

	public static init({
		name = '',
		characters = new Array<string>(), // list of character IDs
		id = uuid(),
		creationDate = Date.now(),
		lastUpdate = Date.now()
	}): IPartyData {
		return { name, id, creationDate, lastUpdate, characters };
	}

	// return character object from character list by its ID
	public static getCharacterById(id: string, characters: ICharacterData[]): ICharacterData {
		return characters.filter((char) => char.id === id)[0];
	}

	// returns random character party array
	public static getRandomCharacters(count: number): ICharacterData[] {
		const characters = getRandomNames(count, this.maxNameLength);
		const jobs = getRandomArrayItems(Jobs.keys(), count);

		return characters.map((char, i) => CharacterData.random(char, jobs[i]));
	}

	public static validate(party: ICharacterData[] = []): string|true {
		party = party.filter((char) => !!char);

		if (!party.length) {
			return true;
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
	}
}
