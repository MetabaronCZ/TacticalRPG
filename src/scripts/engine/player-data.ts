import { IPartyData } from 'engine/party-data';
import { ICharacterData } from 'engine/character-data';
import { PlayerControlID } from 'engine/player-control';

export interface IPlayerData {
	readonly name: string;
	readonly control: PlayerControlID;
	readonly party: string;
	readonly parties: IPartyData[];
	readonly characters: ICharacterData[];
}
