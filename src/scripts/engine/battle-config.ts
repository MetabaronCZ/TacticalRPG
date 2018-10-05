import { observable, action } from 'mobx';
import { PlayerConfig, IPlayerConfig } from 'engine/player-config';

export interface IBattleConfig {
	players: IPlayerConfig[];
}

export class BattleConfig {
	@observable.shallow public players: PlayerConfig[] = [];

	constructor(data?: IBattleConfig) {
		if (data) {
			this.update(data);
		}
	}

	@action
	public update(data: IBattleConfig) {
		this.players = data.players.map(pl => new PlayerConfig(pl));
	}

	public clone(): BattleConfig {
		return new BattleConfig(this.serialize());
	}

	public serialize(): IBattleConfig {
		return {
			players: this.players.map(pl => pl.serialize())
		};
	}
}
