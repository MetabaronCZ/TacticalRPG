import { observable, computed, action } from 'mobx';

import { IValidation } from 'core/validation';
import { playerMaxNameLength, randomPartyID, textInputRegex } from 'data/game-config';
import { IPartyData } from 'modules/party-creation/party-data';

export type PlayerControlID = 'HUMAN' | 'AI';

export interface IPlayerControlData {
	title: string;
}

export interface IPlayerConfig {
	name: string;
	party: string;
	control: PlayerControlID;
}

export type IPlayerConfigEditable = keyof IPlayerConfig;

export class PlayerConfig implements IPlayerConfig {
	@observable private data: IPlayerConfig = {
		name: 'Player',
		control: 'HUMAN',
		party: randomPartyID
	};

	constructor(data: IPlayerConfig) {
		this.setName(data.name);
		this.setControl(data.control);
		this.setParty(data.party);
	}

	public isValidParty(partyID: string, parties: IPartyData[]): boolean {
		return (
			(randomPartyID === partyID) ||
			(-1 !== parties.map(p => p.id).indexOf(partyID))
		);
	}

	@computed
	public get name(): string {
		return this.data.name;
	}

	@computed
	public get control(): PlayerControlID {
		return this.data.control;
	}

	@computed
	public get party(): string {
		return this.data.party;
	}

	@action
	public setName(name: string) {
		this.data.name = name;
	}

	@action
	public setControl(control: PlayerControlID) {
		this.data.control = control;
	}

	@action
	public setParty(partyID: string) {
		this.data.party = partyID;
	}

	public validate(): IValidation<IPlayerConfigEditable> {
		const { name } = this;
		const errors: { [field in IPlayerConfigEditable]?: string; } = {};

		if (name.length < 1 || name.length > playerMaxNameLength) {
			errors.name = `Name should contain 1 to ${playerMaxNameLength} characters`;
		}
		if (!name.match(textInputRegex)) {
			errors.name = 'Name should contain only letters, numbers, spaces or symbols (_, -, .)';
		}
		return {
			isValid: (0 === Object.keys(errors).length),
			errors
		};
	}

	public serialize(): IPlayerConfig {
		const { name, party, control } = this;
		return { name, party, control };
	}
}
