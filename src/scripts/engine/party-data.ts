import { maxPartySize, maxPartyNameLength } from 'data/game-config';

import { validationRules } from 'utils/validation';

import { CharacterData } from 'engine/character-data';
import { IIndexableData, IndexableData } from 'engine/indexable-data';

interface IPartyConfig {
	readonly name: string;
	readonly characters: Array<string|null>;  // list of character IDs
}

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

	public isValid(): boolean {
		const { name, characters } = this;
		return (
			(name.length > 0 && name.length <= maxPartyNameLength) &&
			(!validationRules.name || validationRules.name.test(name)) &&
			maxPartySize === characters.length &&
			characters.filter(char => null !== char).length > 0
		);
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
