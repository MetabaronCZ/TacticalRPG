import { observable, computed, action } from 'mobx';

import { IValidation } from 'core/validation';
import { maxPartySize, maxPartyNameLength, textInputRegex } from 'data/game-config';

import { IIndexableData, IndexableData } from 'modules/indexable-data';
import { CharacterData } from 'modules/character-creation/character-data';

interface IPartyConfig {
	readonly name: string;
	readonly slots: Array<string|null>;  // list of character IDs or empty slots
}

export type IPartyDataEditable = keyof IPartyConfig;
export type IPartyData = IPartyConfig & IIndexableData;

export class PartyData extends IndexableData {
	@observable private data = {
		name: '',
		slots: Array(maxPartySize).fill(null) as Array<CharacterData|null>
	};

	constructor(conf: Partial<IPartyData> = {}, characters: CharacterData[] = []) {
		super({
			id: conf.id,
			creationDate: conf.creationDate,
			lastUpdate: conf.lastUpdate
		});

		if (conf.name) {
			this.setName(conf.name);
		}

		if (conf.slots && characters.length) {
			conf.slots.forEach((item, i) => {
				const character = characters.find(char => item === char.id) || null;
				this.setSlot(character, i);
			});
		}
	}

	public validate(): IValidation<IPartyDataEditable> {
		const { name, slots } = this;
		const errors: { [field in IPartyDataEditable]?: string; } = {};

		if (name.length < 1 || name.length > maxPartyNameLength) {
			errors.name = `Name should contain 1 to ${maxPartyNameLength} characters`;
		}
		if (!name.match(textInputRegex)) {
			errors.name = 'Name should contain only letters, numbers, spaces or symbols (_, -, .)';
		}
		if (maxPartySize !== slots.length) {
			errors.slots = `Party must contain exactly ${maxPartySize} character slots`;
		}
		if (0 === slots.filter(item => null !== item).length) {
			errors.slots = 'Party must contain at least one character';
		}
		return {
			isValid: (0 === Object.keys(errors).length),
			errors
		};
	}

	@computed
	public get name(): string {
		return this.data.name;
	}

	@computed
	public get slots(): Array<CharacterData|null> {
		return this.data.slots;
	}

	@computed
	public get characters(): CharacterData[] {
		const characters: CharacterData[] = [];

		for (const item of this.data.slots) {
			if (null !== item) {
				characters.push(item);
			}
		}
		return characters;
	}

	public getCharacter(slot: number): CharacterData|null {
		if (slot < 0 || slot >= maxPartySize) {
			throw new Error(`Could not get character: invalid slot "${slot}"`);
		}
		return this.data.slots[slot] || null;
	}

	@action
	public setName(name: string) {
		this.data.name = name;
		super.update();
	}

	@action
	public setSlot(char: CharacterData|null, slot: number) {
		if (slot < 0 || slot >= maxPartySize) {
			throw new Error(`Could not set character: invalid slot "${slot}"`);
		}
		this.data.slots[slot] = char;
		super.update();
	}

	@action
	public removeCharacter(id: string) {
		this.data.slots = this.data.slots.map(item => {
			if (null === item || id === item.id) {
				return null;
			}
			return item;
		});

		super.update();
	}

	public serialize(): IPartyData {
		return {
			...super.serialize(),
			name: this.data.name,
			slots: this.data.slots.map(item => item ? item.id : null)
		};
	}
}
