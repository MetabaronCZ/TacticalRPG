import { PartyData } from 'engine/party-creation/party-data';
import { CharacterData } from 'engine/character-creation/character-data';
import { PlayerControlID } from 'engine/battle-configuration/player-config';

export interface IPlayerData {
	readonly name: string;
	readonly control: PlayerControlID;
	readonly party: string;
	readonly parties: PartyData[];
	readonly characters: CharacterData[];
}
