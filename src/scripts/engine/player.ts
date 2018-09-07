import nameSamples from 'data/names';
import { maxPartyNameLength, characterCount } from 'data/game-config';
import RandomNameGenerator from 'core/random-name-generator';

import Character from 'engine/character';

import { IParty } from 'modules/party/types';
import CharacterData from 'modules/character-data';
import { ICharacterData } from 'modules/character-data/types';

export type PlayerControl = 'HUMAN' | 'AI';

export interface IPlayerData {
	control: PlayerControl;
	readonly party?: IParty;
	readonly characters?: ICharacterData[];
}

class Player {
	private control: PlayerControl;
	private characters: Character[] = [];

	constructor(data: IPlayerData) {
		this.characters = this.prepareCharacters(data);
		this.control = data.control;
	}

	public getCharacters(): Character[] {
		return this.characters;
	}

	public getControl(): PlayerControl {
		return this.control;
	}

	private prepareCharacters(playerData: IPlayerData, count = characterCount): Character[] {
		const { characters, party } = playerData;

		if (party && characters) {
			return this.preparePartyCharacters(party, characters);
		}
		if (count) {
			return this.prepareRandomCharacters(count);
		}
		throw new Error('Could not prepare character data');
	}

	private preparePartyCharacters(party: IParty, characters: ICharacterData[]): Character[] {
		const charData = party.characters
			.map(id => characters.filter(char => char.id === id)[0]) // convert party character IDs to character data
			.filter(char => !!char); // filter empty slots

		return charData.map((data, i) => new Character(data, this));
	}

	private prepareRandomCharacters(count: number) {
		const charNames = RandomNameGenerator.get(nameSamples, count, maxPartyNameLength);

		return charNames.map((name, i) => {
			const charData = CharacterData.random(name);
			return new Character(charData, this);
		});
	}
}

export default Player;
