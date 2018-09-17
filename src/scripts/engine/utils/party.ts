import uuid from 'uuid/v1';

import { IPartyData } from 'engine/party-data';
import { CharacterData } from 'engine/character-data';

export const createParty = (conf = {}): IPartyData => {
	const now = Date.now();
	const chars: string[] = [];

	const defaultParty: IPartyData = {
		id: uuid(),
		name: '',
		characters: chars,
		creationDate: now,
		lastUpdate: now
	};

	return Object.assign({}, defaultParty, conf);
};

// return character object from character list by its ID
export const getCharacterById = (id: string, characters: CharacterData[]): CharacterData => {
	return characters.filter(char => char.id === id)[0];
};

export const removeCharacter = (partyList: IPartyData[], char?: CharacterData): IPartyData[] => {
	if (!char || !partyList.length) {
		return partyList;
	}
	const newPartyList: IPartyData[] = [];

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

export const validateParty = (party: CharacterData[] = []): string|true => {
	party = party.filter(char => !!char);

	if (!party.length) {
		return true;
	}
	const ids = party.map(char => char.id);
	const idErrs: string[] = [];

	ids.forEach((id, i) => {
		const name = party[i].getName();

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
