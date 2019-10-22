import { observable, action } from 'mobx';

import { randomPartyID } from 'data/game-config';

import { IPartyData } from 'modules/party-creation/party-data';
import { ICharacterData } from 'modules/character-creation/character-data';
import { BattleConfig, IBattleConfigValidation } from 'modules/battle-configuration/battle-config';
import { IPlayerDataEditable, PlayerData, PlayerControlID } from 'modules/battle-configuration/player-data';

interface IBattleConfiguration {
	config: BattleConfig;
	validation: IBattleConfigValidation;
}

class BattleConfiguration {
	@observable public state: IBattleConfiguration;
	public readonly parties: IPartyData[];

	constructor(data?: BattleConfig, parties: IPartyData[] = []) {
		this.state = {
			config: new BattleConfig(data ? data.serialize() : null),
			validation: {
				isValid: true,
				errors: {
					players: [{}, {}]
				}
			}
		};

		// fix invalid party selections
		for (const pl of this.state.config.players) {
			if (!pl.isValidParty(pl.party, parties)) {
				pl.setParty(randomPartyID);
			}
		}

		this.parties = parties;
	}

	@action
	public onPlayerChange(field: IPlayerDataEditable, i: number, value: string): void {
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
	public onSubmit(next: (config: BattleConfig) => void): void {
		const config = this.state.config;
		const validation = config.validate();

		if (!validation.isValid) {
			this.state.validation = validation;
			return;
		}
		next(config);
	}

	public getPartyCharacters(player: PlayerData, characters: ICharacterData[] = []): ICharacterData[] {
		const chars: ICharacterData[] = [];

		if (randomPartyID !== player.party) {
			const parties = this.parties;
			const selectedParty = parties.find(party => player.party === party.id);

			if (selectedParty) {
				for (const id of selectedParty.slots) {
					const char = characters.find(ch => id === ch.id);

					if (char) {
						chars.push(char);
					}
				}
			}
		}
		return chars;
	}
}

export default BattleConfiguration;
