import { maxPartySize } from 'data/game-config';

import { IActRecord } from 'modules/battle/act';
import { PlayerList } from 'modules/battle/engine';
import { IPartyData, PartyData } from 'modules/party-creation/party-data';
import { IPlayerConfig } from 'modules/battle-configuration/player-config';
import { ICharacterData } from 'modules/character-creation/character-data';

export type ChronoxPlayerList =  [IPlayerConfig, IPlayerConfig];

export interface IChronoxConfig {
	characters: ICharacterData[];
	players: ChronoxPlayerList;
	parties: IPartyData[];
}

export interface IChronoxRecord {
	characters: ICharacterData[];
	players: ChronoxPlayerList;
	parties: IPartyData[];
	timeline: IActRecord[];
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

	public static getConfig(players: PlayerList, parties: PartyData[]): IChronoxConfig {
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
				const data = party.serialize();
				return { ...data, id: partyID } as IPartyData;
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
