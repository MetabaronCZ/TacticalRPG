import { observable } from 'mobx';

import { IValidation } from 'engine/validation';
import { playerMaxNameLength } from 'data/game-config';

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
	@observable public name: string;
	@observable public party: string;
	@observable public control: PlayerControlID;

	constructor(data: IPlayerConfig) {
		this.name = data.name;
		this.party = data.party;
		this.control = data.control;
	}

	public validate(): IValidation<IPlayerConfigEditable> {
		const { name } = this;
		const errors: { [field in IPlayerConfigEditable]?: string; } = {};

		if (name.length < 1 || name.length > playerMaxNameLength) {
			errors.name = `Name should contain 1 to ${playerMaxNameLength} characters`;
		}
		if (!name.match(/^[a-zA-Z0-9-_\s.]+$/)) {
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
