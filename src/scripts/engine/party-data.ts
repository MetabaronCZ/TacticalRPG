import uuid from 'uuid/v1';

import { IIndexable } from 'engine/indexable';
import { ICharacterData } from 'modules/character-data/types';

export interface IPartyData extends IIndexable {
	readonly name: string;
	readonly characters: string[];  // list of character IDs
}

class PartyUtils {
	public static create(conf = {}): IPartyData {
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
	}

	// return character object from character list by its ID
	public static getCharacterById(id: string, characters: ICharacterData[]): ICharacterData {
		return characters.filter(char => char.id === id)[0];
	}

	public static removeCharacter(partyList: IPartyData[], char?: ICharacterData): IPartyData[] {
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
	}

	public static validate(party: ICharacterData[] = []): string|true {
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
	}
}

export default PartyUtils;
