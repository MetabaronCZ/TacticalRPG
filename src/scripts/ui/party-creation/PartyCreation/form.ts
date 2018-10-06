import { observable, action } from 'mobx';

import { IValidation } from 'engine/validation';
import { CharacterData } from 'engine/character-data';
import { PartyData, IPartyDataEditable } from 'engine/party-data';

interface IPartyCreationForm {
	party: PartyData;
	validation: IValidation<IPartyDataEditable>;
}

class PartyCreationform {
	@observable public state: IPartyCreationForm;
	private characters: CharacterData[];

	constructor(data?: PartyData, characters: CharacterData[] = []) {
		this.state = {
			party: new PartyData(data ? data.serialize() : {}, characters),
			validation: {
				isValid: true,
				errors: {}
			}
		};
		this.characters = characters;
	}

	@action
	public onChange(field: IPartyDataEditable, i: number|null, value: string) {
		const party = this.state.party;

		if ('name' === field) {
			party.setName(value);

		} else if ('characters' === field && null !== i) {
			const char = this.characters.find(ch => value === ch.id) || null;
			party.setCharacter(char, i);
		}

		this.state.validation = party.validate();
	}

	@action
	public onSubmit(next?: (party: PartyData) => void) {
		const party = this.state.party;
		const validation = party.validate();

		if (!validation.isValid) {
			this.state.validation = validation;
			return;
		}

		if (next) {
			next(party);
		}
	}

	public filterCharacters(character: CharacterData|null): CharacterData[] {
		const characters = this.characters;

		if (!characters.length) {
			return [];
		}
		const selected = this.state.party.getCharacters()
			.map(char => char ? char.id : null)
			.filter(id => null !== id);

		// filter unselected characters (keep character itself)
		return characters.filter(char => {
			return (character && char.id === character.id) || -1 === selected.indexOf(char.id);
		});
	}
}

export default PartyCreationform;
