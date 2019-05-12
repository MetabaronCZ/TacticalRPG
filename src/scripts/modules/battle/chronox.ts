import { IActRecord } from 'modules/battle/act';
import { IPartyData } from 'modules/party-creation/party-data';
import { IPlayerConfig } from 'modules/battle-configuration/player-config';
import { ICharacterData } from 'modules/character-creation/character-data';

const KEY = 'chronox';

export interface IChronoxConfig {
	characters: ICharacterData[];
	players: IPlayerConfig[];
	parties: IPartyData[];
}

export interface IChronoxRecord {
	characters: ICharacterData[];
	players: IPlayerConfig[];
	parties: IPartyData[];
	timeline: IActRecord[];
}

class Chronox {
	private readonly characters: ICharacterData[];
	private readonly players: IPlayerConfig[];
	private readonly parties: IPartyData[];
	private readonly timeline: IActRecord[] = []; // character decision records

	constructor(config: IChronoxConfig) {
		this.characters = config.characters;
		this.players = config.players;
		this.parties = config.parties;
	}

	public static loadRecord(): IChronoxRecord {
		const data = sessionStorage.getItem(KEY);

		if (!data) {
			throw new Error('Could not create Chronox: No save data');
		}
		try {
			return JSON.parse(data) as IChronoxRecord;
		} catch (err) {
			throw new Error('Could not create Chronox: Invalid save data');
		}
	}

	public static saveRecord(record: IChronoxRecord) {
		sessionStorage.setItem(KEY, JSON.stringify(record));
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
