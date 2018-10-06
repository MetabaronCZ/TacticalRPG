import { observable, action } from 'mobx';

import { randomPartyID, maxPlayers } from 'data/game-config';

import { PartyData } from 'engine/party-data';
import ObservableList from 'engine/observable-list';
import { CharacterData } from 'engine/character-data';
import { IPlayerConfigEditable, PlayerConfig } from 'engine/player-config';
import { BattleConfig, IBattleConfigValidation } from 'engine/battle-config';

interface IBattleConfigForm {
	config: BattleConfig;
	validation: IBattleConfigValidation;
}

class BattleConfigForm {
	@observable public state: IBattleConfigForm;
	public parties: PartyData[];

	constructor(data?: BattleConfig, parties: PartyData[] = []) {
		this.state = {
			config: new BattleConfig(data),
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
		player[field] = value;
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

	public getPartyCharacters(player: PlayerConfig): ObservableList<CharacterData> {
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
		return new ObservableList(characters);
	}
}

export default BattleConfigForm;
