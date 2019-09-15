import { observable, action } from 'mobx';

import { IValidation } from 'core/validation';
import { ICharacterData } from 'modules/character-creation/character-data';
import { PartyData, IPartyDataEditable } from 'modules/party-creation/party-data';

interface IPartyCreation {
	party: PartyData;
	validation: IValidation<IPartyDataEditable>;
}

class PartyCreation {
	@observable public state: IPartyCreation;
	private characters: ICharacterData[];

	constructor(data?: PartyData, characters: ICharacterData[] = []) {
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
	public change(field: IPartyDataEditable, i: number | null, value: string): void {
		const party = this.state.party;

		if ('name' === field) {
			party.setName(value);

		} else if ('slots' === field && null !== i) {
			const char = this.characters.find(ch => value === ch.id);
			party.setSlot(char ? char.id : null, i);
		}
		this.state.validation = party.validate();
	}

	@action
	public get(): PartyData | null {
		const party = this.state.party;
		const validation = party.validate();

		if (!validation.isValid) {
			this.state.validation = validation;
			return null;
		}
		return party;
	}

	public filterCharacters(character: ICharacterData | null): ICharacterData[] {
		const characters = this.characters;

		if (!characters.length) {
			return [];
		}
		const selected = this.state.party.characters;
		const charID = (character ? character.id : null);

		// filter unselected characters (keep character itself)
		return characters.filter(({ id }) => {
			return charID === id || -1 === selected.indexOf(id);
		});
	}
}

export default PartyCreation;
