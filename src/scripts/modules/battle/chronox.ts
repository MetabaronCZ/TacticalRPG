import { IActRecord } from 'modules/battle/act';
import { IPartyData } from 'modules/party-creation/party-data';
import { IPlayerConfig } from 'modules/battle-configuration/player-config';
import { ICharacterData } from 'modules/character-creation/character-data';

export type ChronoxPlayerList =  [IPlayerConfig, IPlayerConfig];

export interface IChronoxConfig {
	initiative: number[];
	characters: ICharacterData[];
	players: ChronoxPlayerList;
	parties: IPartyData[];
}

export interface IChronoxRecord {
	initiative: number[];
	characters: ICharacterData[];
	players: ChronoxPlayerList;
	parties: IPartyData[];
	timeline: IActRecord[];
}

class Chronox {
	private readonly initiative: number[];
	private readonly characters: ICharacterData[];
	private readonly players: ChronoxPlayerList;
	private readonly parties: IPartyData[];
	private readonly timeline: IActRecord[] = []; // character decision records

	constructor(config: IChronoxConfig) {
		this.initiative = config.initiative;
		this.characters = config.characters;
		this.players = config.players;
		this.parties = config.parties;
	}

	public store(record: IActRecord) {
		this.timeline.push(record);
	}

	public serialize(): IChronoxRecord {
		return {
			initiative: this.initiative,
			characters: this.characters,
			players: this.players,
			parties: this.parties,
			timeline: this.timeline
		};
	}
}

export default Chronox;
