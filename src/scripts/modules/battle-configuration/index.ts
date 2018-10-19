import { observable, action } from 'mobx';

import { randomPartyID, maxPlayers } from 'data/game-config';

import IndexableList from 'modules/indexable-list';
import { PartyData } from 'modules/party-creation/party-data';
import { CharacterData } from 'modules/character-creation/character-data';
import { BattleConfig, IBattleConfigValidation } from 'modules/battle-configuration/battle-config';
import { IPlayerConfigEditable, PlayerConfig, PlayerControlID } from 'modules/battle-configuration/player-config';

interface IBattleConfiguration {
	config: BattleConfig;
	validation: IBattleConfigValidation;
}

class BattleConfiguration {
	@observable public state: IBattleConfiguration;
	public parties: PartyData[];

	constructor(data?: BattleConfig, parties: PartyData[] = []) {
		this.state = {
			config: new BattleConfig(data, parties.map(p => p.serialize())),
			validation: {
				isValid: true,
				errors: {
					players: Array(maxPlayers).fill({})
				}
			}
		};
		this.parties = parties;
	}

	@action
	public onPlayerChange(field: IPlayerConfigEditable, i: number, value: string) {
		const config = this.state.config;
		const player = config.players[i];

		switch (field) {
			case 'name':
				player.setName(value);
				break;
			case 'control':
				player.setControl(value as PlayerControlID);
				break;
			case 'party':
				player.setParty(value);
				break;
			default:
				throw new Error('Invalid field: not editable');
		}
		this.state.validation = config.validate();
	}

	@action
	public onSubmit(next?: (config: BattleConfig) => void) {
		const config = this.state.config;
		const validation = config.validate();

		if (!validation.isValid) {
			this.state.validation = validation;
			return;
		}

		if (next) {
			next(config);
		}
	}

	public getPartyCharacters(player: PlayerConfig): IndexableList<CharacterData> {
		const characters: CharacterData[] = [];
		const parties = this.parties;

		if (randomPartyID !== player.party) {
			const selecteParty = parties.find(party => player.party === party.id);

			if (selecteParty) {
				for (const char of selecteParty.getCharacters()) {
					if (null !== char) {
						characters.push(char);
					}
				}
			}
		}
		return new IndexableList(characters);
	}
}

export default BattleConfiguration;
