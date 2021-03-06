import { observable, computed, action } from 'mobx';

import { IValidation } from 'core/validation';
import { playerMaxNameLength, randomPartyID, textInputRegex } from 'data/game-config';

import { IPartyData } from 'modules/party-creation/party-data';

export type PlayerControlID = 'USER' | 'AI';

export interface IPlayerControlData {
	readonly title: string;
}

export interface IPlayerConfig {
	name: string;
	party: string;
	control: PlayerControlID;
}

interface IPlayerIndexable {
	readonly id: number;
}
export type IPlayerDataEditable = keyof IPlayerConfig;
export type IPlayerData = IPlayerIndexable & IPlayerConfig;

export class PlayerData implements IPlayerData {
	public readonly id: number;

	@observable private data: IPlayerConfig = {
		name: 'Player',
		control: 'USER',
		party: randomPartyID
	};

	constructor(id: number, data: Partial<IPlayerData>) {
		const conf: IPlayerData = { ...this.data, ...data, id };
		this.id = conf.id;
		this.setName(conf.name);
		this.setParty(conf.party);
		this.setControl(conf.control);
	}

	public isValidParty(partyID: string, parties: IPartyData[]): boolean {
		return (
			(randomPartyID === partyID) ||
			parties.map(p => p.id).includes(partyID)
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
	public setName(name: string): void {
		this.data.name = name;
	}

	@action
	public setControl(control: PlayerControlID): void {
		this.data.control = control;
	}

	@action
	public setParty(partyID: string): void {
		this.data.party = partyID;
	}

	public validate(): IValidation<IPlayerDataEditable> {
		const { name } = this;
		const errors: { [field in IPlayerDataEditable]?: string; } = {};

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

	public serialize(): IPlayerData {
		const { id, name, party, control } = this;
		return { id, name, party, control };
	}
}
