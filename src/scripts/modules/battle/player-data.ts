import { PartyData } from 'modules/party-creation/party-data';
import { CharacterData } from 'modules/character-creation/character-data';
import { PlayerControlID } from 'modules/battle-configuration/player-config';

export interface IPlayerData {
	readonly name: string;
	readonly control: PlayerControlID;
	readonly party: string;
	readonly parties: PartyData[];
	readonly characters: CharacterData[];
}
