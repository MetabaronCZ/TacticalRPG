import { observable } from 'mobx';

import { maxPlayers, randomPartyID } from 'data/game-config';
import { PlayerConfig, IPlayerConfig, IPlayerConfigEditable } from 'modules/battle-configuration/player-config';
import { IPartyData } from 'modules/party-creation/party-data';

export interface IBattleConfig {
	players: IPlayerConfig[];
}

export interface IBattleConfigValidation {
	isValid: boolean;
	errors: {
		players: Array<{
			[attr in IPlayerConfigEditable]?: string;
		}>;
	};
}

const playerPool = Array(maxPlayers).fill(0);

export class BattleConfig {
	@observable.shallow public players: PlayerConfig[] = [];
	private parties: IPartyData[] = [];

	constructor(data?: IBattleConfig, parties: IPartyData[] = []) {
		this.parties = parties;
		this.update(data);
	}

	public validate(): IBattleConfigValidation {
		const { players } = this;

		const validation: IBattleConfigValidation = {
			isValid: true,
			errors: {
				players: playerPool.map(_ => ({}))
			}
		};

		players.forEach((player, p) => {
			const val = player.validate();

			if (!val.isValid) {
				validation.isValid = false;
			}
			validation.errors.players[p] = val.errors;
		});

		return validation;
	}

	public update(data?: IBattleConfig) {
		const parties = this.parties;

		this.players = playerPool.map((_, p) => {
			let conf: IPlayerConfig;

			if (data && data.players[p]) {
				conf = data.players[p];

			} else {
				conf = {
					name: `Player ${p + 1}`,
					control: 'HUMAN',
					party: randomPartyID
				};
			}
			return new PlayerConfig(conf, parties);
		});
	}

	public serialize(): IBattleConfig {
		return {
			players: this.players.map(pl => pl.serialize())
		};
	}
}
