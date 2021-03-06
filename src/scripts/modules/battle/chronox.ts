import { maxPartySize } from 'data/game-config';

import { IActRecord } from 'modules/battle/act';
import { PlayerList } from 'modules/battle/engine';
import { IPartyData } from 'modules/party-creation/party-data';
import { IPlayerData } from 'modules/battle-configuration/player-data';
import { ICharacterData } from 'modules/character-creation/character-data';

type ChronoxPlayerList =  [IPlayerData, IPlayerData];

interface IChronoxConfig {
	readonly characters: ICharacterData[];
	readonly players: ChronoxPlayerList;
	readonly parties: IPartyData[];
}

export interface IChronoxRecord {
	readonly characters: ICharacterData[];
	readonly players: ChronoxPlayerList;
	readonly parties: IPartyData[];
	readonly timeline: IActRecord[];
}

class Chronox {
	private readonly characters: ICharacterData[];
	private readonly players: ChronoxPlayerList;
	private readonly parties: IPartyData[];
	private readonly timeline: IActRecord[] = []; // character decision records

	constructor(config: IChronoxConfig) {
		this.characters = config.characters;
		this.players = config.players;
		this.parties = config.parties;
	}

	public static getConfig(players: PlayerList, parties: IPartyData[]): IChronoxConfig {
		const chPlayers = players.map((pl, p) => ({
			...pl.data,
			party: 'PARTY-' + p
		}));

		const chChars = players
			.map(pl => pl.getCharacters().map(char => char.data))
			.reduce((a, b) => a.concat(b));

		const chParties = players.map((pl, p) => {
			const partyID = 'PARTY-' + p;
			const party = parties.find(pt => pl.data.party === pt.id);

			if (party) {
				return { ...party, id: partyID } as IPartyData;
			}
			const chars = pl.getCharacters();

			const slots = Array(maxPartySize).fill(null)
				.map((slot, s) => chars[s] ? chars[s].data.id : null);

			return {
				id: partyID,
				name: 'UNKNOWN',
				creationDate: Date.now(),
				lastUpdate: Date.now(),
				slots
			} as IPartyData;
		});

		return {
			characters: chChars,
			players: chPlayers as ChronoxPlayerList,
			parties: chParties
		};
	}

	public store(record: IActRecord): void {
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
