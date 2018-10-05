import { observable } from 'mobx';

export type PlayerControlID = 'HUMAN' | 'AI';

export interface IPlayerControlData {
	title: string;
}

export interface IPlayerConfig {
	name: string;
	party: string;
	control: PlayerControlID;
}

export class PlayerConfig {
	@observable public name: string;
	@observable public party: string;
	@observable public control: PlayerControlID;

	constructor(data: IPlayerConfig) {
		this.name = data.name;
		this.party = data.party;
		this.control = data.control;
	}

	public serialize(): IPlayerConfig {
		const { name, party, control } = this;
		return { name, party, control };
	}
}
