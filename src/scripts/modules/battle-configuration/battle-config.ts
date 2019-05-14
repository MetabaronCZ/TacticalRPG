import { observable, action } from 'mobx';

import { maxPlayers, randomPartyID } from 'data/game-config';
import { PlayerConfig, IPlayerConfig, IPlayerConfigEditable } from 'modules/battle-configuration/player-config';

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

	constructor(data: IBattleConfig | null) {
		// init player slots
		this.players = playerPool.map((_, i) => {
			const conf: IPlayerConfig = {
				name: `Player ${i + 1}`,
				control: 'HUMAN',
				party: randomPartyID,
				aiSettings: {
					preset: 'RANK_1',
					config: {}
				}
			};
			return new PlayerConfig(conf);
		});

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

	@action
	public update(data: IBattleConfig | null) {
		if (null === data) {
			return;
		}
		this.players = this.players.map((pl, i) => {
			return new PlayerConfig({
				...pl.serialize(),
				...data.players[i]
			});
		});
	}

	public serialize(): IBattleConfig {
		return {
			players: this.players.map(pl => pl.serialize())
		};
	}
}
