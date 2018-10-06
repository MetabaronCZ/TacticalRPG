import { observable } from 'mobx';

import { maxPlayers, randomPartyID } from 'data/game-config';
import { PlayerConfig, IPlayerConfig, IPlayerConfigEditable } from 'engine/player-config';

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

	constructor(data?: IBattleConfig) {
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
		this.players = playerPool.map((_, p) => {
			if (data && data.players[p]) {
				return new PlayerConfig(data.players[p]);

			} else {
				return new PlayerConfig({
					name: `Player ${p + 1}`,
					control: 'HUMAN',
					party: randomPartyID
				});
			}
		});
	}

	public serialize(): IBattleConfig {
		return {
			players: this.players.map(pl => pl.serialize())
		};
	}
}
