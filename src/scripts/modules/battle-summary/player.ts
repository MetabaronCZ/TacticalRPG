import { IChronoxRecord } from 'modules/battle/chronox';
import { IPartyData } from 'modules/party-creation/party-data';
import { IPlayerConfig } from 'modules/battle-configuration/player-data';
import { ICharacterData } from 'modules/character-creation/character-data';

export interface ISummaryPlayerData {
	readonly id: number;
	readonly party: IPartyData;
	readonly player: IPlayerConfig;
	readonly characters: ICharacterData[];
}

export const getPlayerData = (record: IChronoxRecord): ISummaryPlayerData[] => {
	const { characters, players, parties } = record;

	return players.map(pl => {
		const party = parties.find(pt => pl.party === pt.id);
	
		const chars = party
			? party.slots.map(sl => characters.find(char => sl === char.id))
			: [];
	
		return {
			id: pl.id,
			player: pl,
			party,
			characters: chars.filter(char => !!char) as ICharacterData[]
		} as ISummaryPlayerData;
	});
};
