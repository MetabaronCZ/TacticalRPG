import uuid from 'uuid/v1';

import nameSamples from 'data/names';
import { maxPartyNameLength } from 'data/game-config';
import RandomNameGenerator from 'core/random-name-generator';

import { IIndexable } from 'modules/indexable';
import { ICharacterData, CharacterData } from 'modules/character-data';

export interface IParty extends IIndexable {
	readonly name: string;
	readonly characters: string[];  // list of character IDs
}

export type IOnMoveDown = (partyId: string) => () => void;
export type IOnMoveUp = (partyId: string) => () => void;
export type IOnDelete = (party: IParty) => () => void;

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
	const characters = RandomNameGenerator.get(nameSamples, count, maxPartyNameLength);
	return characters.map((char, i) => CharacterData.random(char));
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

	// party is valid
	return true;
};

export const Party = {
	create,
	getCharacterById,
	getRandomCharacters,
	removeCharacter,
	validate
};
