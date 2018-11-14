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
		slots: Array(maxPartySize).fill(null) as Array<string|null>
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
			conf.slots.forEach((id, i) => {
				// check character with given ID exists
				if (characters.find(char => id === char.id)) {
					this.setSlot(id, i);
				}
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
	public get slots(): Array<string|null> {
		return this.data.slots;
	}

	@computed
	public get characters(): string[] {
		const characters: string[] = [];

		for (const id of this.data.slots) {
			if (null !== id) {
				characters.push(id);
			}
		}
		return characters;
	}

	@action
	public setName(name: string) {
		this.data.name = name;
		super.update();
	}

	@action
	public setSlot(id: string|null, slot: number) {
		if (slot < 0 || slot >= maxPartySize) {
			throw new Error(`Could not set character: invalid slot "${slot}"`);
		}
		this.data.slots[slot] = id;
		super.update();
	}

	public serialize(): IPartyData {
		const { name, slots } = this.data;
		return { ...super.serialize(), name, slots };
	}
}
