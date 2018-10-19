import { observable, computed, action } from 'mobx';

import { playerMaxNameLength, randomPartyID } from 'data/game-config';

import { IValidation } from 'modules/validation';
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

export class PlayerConfig {
	@observable private data: IPlayerConfig = {
		name: 'Player',
		control: 'HUMAN',
		party: randomPartyID
	};
	private parties: IPartyData[] = [];

	constructor(data: IPlayerConfig, parties: IPartyData[] = []) {
		this.parties = parties;
		this.setName(data.name);
		this.setControl(data.control);
		this.setParty(data.party);
	}

	public isValidParty(partyID: string): boolean {
		return (
			(randomPartyID === partyID) ||
			(-1 !== this.parties.map(p => p.id).indexOf(partyID))
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
		if (this.isValidParty(partyID)) {
			this.data.party = partyID;
		}
	}

	public validate(): IValidation<IPlayerConfigEditable> {
		const { name, party } = this;
		const errors: { [field in IPlayerConfigEditable]?: string; } = {};

		if (name.length < 1 || name.length > playerMaxNameLength) {
			errors.name = `Name should contain 1 to ${playerMaxNameLength} characters`;
		}
		if (!name.match(/^[a-zA-Z0-9-_\s.]+$/)) {
			errors.name = 'Name should contain only letters, numbers, spaces or symbols (_, -, .)';
		}
		if (!this.isValidParty(party)) {
			errors.party = 'Invalid party ID';
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
