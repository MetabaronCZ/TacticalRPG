import { observable, action } from 'mobx';
import { CharacterData, ICharacterDataEditable } from 'engine/character-data';
import { validateField, validateForm } from 'utils/validation';

interface ICharacterCreationform {
	character: CharacterData;
	errors: {
		[attr in ICharacterDataEditable]?: string;
	};
}

class CharacterCreationform {
	@observable public state: ICharacterCreationform;

	constructor(char: CharacterData|null) {
		this.state = {
			character: new CharacterData(char ? char.serialize() : {}),
			errors: {}
		};
	}

	@action
	public onChange(field: ICharacterDataEditable, value: string) {
		const validation = validateField(field, value);
		this.state.character.set(field, value);
		this.state.errors[field] = validation.error || undefined;
	}

	@action
	public onSubmit(next?: (char: CharacterData) => void) {
		const character = this.state.character;

		if (!character.isValid()) {
			const validation = validateForm(character.serialize());
			this.state.errors = validation.errors;
			return;
		}

		if (next) {
			next(character);
		}
	}
}

export default CharacterCreationform;
