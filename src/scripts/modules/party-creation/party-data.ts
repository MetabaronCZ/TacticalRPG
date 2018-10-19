import { IValidation } from 'core/validation';
import { maxPartySize, maxPartyNameLength } from 'data/game-config';

import { IIndexableData, IndexableData } from 'modules/indexable-data';
import { CharacterData } from 'modules/character-creation/character-data';

interface IPartyConfig {
	readonly name: string;
	readonly characters: Array<string|null>;  // list of character IDs
}

export type IPartyDataEditable = keyof IPartyConfig;
export type IPartyData = IPartyConfig & IIndexableData;

const defaults: IPartyConfig = {
	name: '',
	characters: Array(maxPartySize).fill(null)
};

export class PartyData extends IndexableData {
	private name: string;
	private characters: Array<CharacterData|null>;

	constructor(conf: Partial<IPartyData> = {}, characters: CharacterData[] = []) {
		super({
			id: conf.id,
			creationDate: conf.creationDate,
			lastUpdate: conf.lastUpdate
		});

		const data: IPartyConfig = Object.assign({}, defaults, conf);
		this.name = data.name;

		this.characters = data.characters.map(id => {
			if (null === id) {
				return id;
			}
			return characters.find(ch => id === ch.id) || null;
		});
	}

	public validate(): IValidation<IPartyDataEditable> {
		const { name, characters } = this;
		const errors: { [field in IPartyDataEditable]?: string; } = {};

		if (name.length < 1 || name.length > maxPartyNameLength) {
			errors.name = `Name should contain 1 to ${maxPartyNameLength} characters`;
		}
		if (!name.match(/^[a-zA-Z0-9-_\s.]+$/)) {
			errors.name = 'Name should contain only letters, numbers, spaces or symbols (_, -, .)';
		}
		if (maxPartySize !== characters.length) {
			errors.characters = `Party must contain exactly ${maxPartySize} character slots`;
		}
		if (0 === characters.filter(char => null !== char).length) {
			errors.characters = 'Party must contain at least one character';
		}
		return {
			isValid: (0 === Object.keys(errors).length),
			errors
		};
	}

	public getName(): string {
		return this.name;
	}

	public getCharacters(): Array<CharacterData|null> {
		return this.characters;
	}

	public getCharacter(slot: number): CharacterData|null {
		if (slot < 0 || slot >= maxPartySize) {
			throw new Error(`Could not get character: invalid slot "${slot}"`);
		}
		return this.characters[slot] || null;
	}

	public setName(name: string) {
		this.name = name;
	}

	public setCharacter(char: CharacterData|null, slot: number) {
		if (slot < 0 || slot >= maxPartySize) {
			throw new Error(`Could not set character: invalid slot "${slot}"`);
		}
		this.characters[slot] = char;
	}

	public removeCharacter(id: string) {
		this.characters = this.characters.map(char => {
			if (null === char || id === char.id) {
				return null;
			}
			return char;
		});
	}

	public serialize(): IPartyData {
		return {
			...super.serialize(),
			name: this.name,
			characters: this.characters.map(char => char ? char.id : null)
		};
	}
}
