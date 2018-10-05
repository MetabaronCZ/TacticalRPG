import { observable, action } from 'mobx';

import { CharacterData } from 'engine/character-data';

class CharacterList {
	@observable.shallow public data: CharacterData[] = [];

	constructor(characters: CharacterData[] = []) {
		this.data = characters;
	}

	public getById(id: string): CharacterData|null {
		return this.data.find(char => char.id === id) || null;
	}

	@action
	public add(char: CharacterData) {
		this.data.push(char);
	}

	@action
	public replace(char: CharacterData) {
		this.data = this.data.map(ch => {
			if (ch.id === char.id) {
				return char;
			} else {
				return ch;
			}
		});
	}

	@action
	public moveDown(char: CharacterData) {
		this.move(char, +1);
	}

	@action
	public moveUp(char: CharacterData) {
		this.move(char, -1);
	}

	@action
	public remove(char: CharacterData) {
		this.data = this.data.filter(ch => ch.id !== char.id);
	}

	public serialize() {
		return this.data.map(char => char.serialize());
	}

	private move(char: CharacterData, diff = 0) {
		if (!diff) {
			return;
		}
		const characters = this.data;
		const index = characters.indexOf(char);

		if (index + diff < 0 || index + diff > characters.length - 1) {
			return;
		}
		const curr = characters[index];
		const next = characters[index + diff];

		this.data = characters.map((item, i) => {
			if (i === index) {
				return next;
			} else if (i === index + diff) {
				return curr;
			} else {
				return item;
			}
		});
	}
}

export default CharacterList;
