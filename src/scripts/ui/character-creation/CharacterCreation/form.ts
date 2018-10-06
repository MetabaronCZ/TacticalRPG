import { observable, action } from 'mobx';

import { IValidation } from 'engine/validation';
import { CharacterData, ICharacterDataEditable } from 'engine/character-data';

interface ICharacterCreationForm {
	character: CharacterData;
	validation: IValidation<ICharacterDataEditable>;
}

class CharacterCreationform {
	@observable public state: ICharacterCreationForm;

	constructor(data: CharacterData|null) {
		this.state = {
			character: new CharacterData(data ? data.serialize() : {}),
			validation: {
				isValid: true,
				errors: {}
			}
		};
	}

	@action
	public onChange(field: ICharacterDataEditable, value: string) {
		const character = this.state.character;
		character.set(field, value);
		this.state.validation = character.validate();
	}

	@action
	public onSubmit(next?: (char: CharacterData) => void) {
		const character = this.state.character;
		const validation = character.validate();

		if (!validation.isValid) {
			this.state.validation = validation;
			return;
		}

		if (next) {
			next(character);
		}
	}
}

export default CharacterCreationform;
