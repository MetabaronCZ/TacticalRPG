import { observable, computed, action } from 'mobx';

import { IValidation } from 'core/validation';
import { playerMaxNameLength, randomPartyID, textInputRegex } from 'data/game-config';

import { IAISettings } from 'modules/ai/settings';
import { IPartyData } from 'modules/party-creation/party-data';

export type PlayerControlID = 'USER' | 'AI';

export interface IPlayerControlData {
	title: string;
}

export interface IPlayerConfig {
	name: string;
	party: string;
	control: PlayerControlID;
	aiSettings: IAISettings;
}

export type IPlayerConfigEditable = keyof IPlayerConfig;

export class PlayerConfig implements IPlayerConfig {
	@observable private data: IPlayerConfig = {
		name: 'Player',
		control: 'USER',
		party: randomPartyID,
		aiSettings: {
			preset: 'RANK_1',
			config: {}
		}
	};

	constructor(data: IPlayerConfig) {
		this.setName(data.name);
		this.setParty(data.party);
		this.setControl(data.control);
		this.setAISettings(data.aiSettings);
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

	@computed get aiSettings(): IAISettings {
		return this.data.aiSettings;
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

	@action
	public setAISettings(settings: IAISettings) {
		this.data.aiSettings = settings;
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
		const { name, party, control, aiSettings } = this;
		return { name, party, control, aiSettings };
	}
}
