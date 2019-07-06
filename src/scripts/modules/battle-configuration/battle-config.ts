import { observable, action } from 'mobx';

import { randomPartyID } from 'data/game-config';
import { PlayerConfig, IPlayerConfig, IPlayerConfigEditable } from 'modules/battle-configuration/player-config';

type PlayerEditable = {
	[attr in IPlayerConfigEditable]?: string;
};

type PlayerEditableList = [PlayerEditable, PlayerEditable];

export type PlayerConfigList = [PlayerConfig, PlayerConfig];

export interface IBattleConfig {
	players: PlayerConfigList;
}

export interface IBattleConfigValidation {
	isValid: boolean;
	errors: {
		players: PlayerEditableList;
	};
}

const playerPool = [0, 1];

export class BattleConfig {
	@observable.shallow public players: PlayerConfigList;

	constructor(data: IBattleConfig | null) {
		// init player slots
		const players = playerPool.map(i => {
			const conf: IPlayerConfig = {
				name: `Player ${i + 1}`,
				control: 'USER',
				party: randomPartyID,
				aiSettings: {
					preset: 'RANK_1',
					config: {}
				}
			};
			return new PlayerConfig(conf);
		});

		this.players = players as PlayerConfigList;

		this.update(data);
	}

	public validate(): IBattleConfigValidation {
		const { players } = this;

		const validation: IBattleConfigValidation = {
			isValid: true,
			errors: {
				players: [{}, {}]
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
		if (!data) {
			return;
		}
		const players = this.players.map((pl, i) => {
			return new PlayerConfig({
				...pl.serialize(),
				...data.players[i]
			});
		});

		this.players = players as PlayerConfigList;
	}

	public serialize(): IBattleConfig {
		return {
			players: this.players.map(pl => pl.serialize()) as PlayerConfigList
		};
	}
}
