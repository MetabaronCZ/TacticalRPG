import { IActRecord } from 'modules/battle/act';
import { IPartyData } from 'modules/party-creation/party-data';
import { IPlayerConfig } from 'modules/battle-configuration/player-config';
import { ICharacterData } from 'modules/character-creation/character-data';

export interface IChronoxRecord {
	characters: ICharacterData[];
	players: IPlayerConfig[];
	parties: IPartyData[];
	timeline: IActRecord[];
}

export interface IChronoxConfig {
	characters: ICharacterData[];
	players: IPlayerConfig[];
	parties: IPartyData[];
}

class Chronox {
	private readonly characters: ICharacterData[] = [];
	private readonly players: IPlayerConfig[] = [];
	private readonly parties: IPartyData[] = [];
	private readonly timeline: IActRecord[] = [];

	constructor(config: IChronoxConfig) {
		this.characters = config.characters;
		this.players = config.players;
		this.parties = config.parties;
	}

	public store(record: IActRecord) {
		this.timeline.push(record);
	}

	public serialize(): IChronoxRecord {
		return {
			characters: this.characters,
			players: this.players,
			parties: this.parties,
			timeline: this.timeline
		};
	}
}

export default Chronox;
