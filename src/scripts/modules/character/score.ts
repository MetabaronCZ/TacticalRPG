import Character from 'modules/character';

export interface IScore {
	readonly damage: number;
	readonly healing: number;
	readonly kills: number;
	readonly revives: number;
	readonly events: IScoreEvent[];
}

type IScoreEventType = 'DAMAGE' | 'HEALING' | 'KILL' | 'REVIVE';

interface IScoreEvent {
	type: IScoreEventType;
	target: string;
	amount: number;
}

class Score {
	private damage = 0;
	private kills = 0;
	private healing = 0;
	private revives = 0;

	private events: IScoreEvent[] = [];

	public setDamage(target: Character, amount: number) {
		this.damage += amount;

		this.events.push({
			type: 'DAMAGE',
			target: target.data.id,
			amount
		});
	}

	public setKill(target: Character) {
		const amount = 1;
		this.kills += amount;

		this.events.push({
			type: 'KILL',
			target: target.data.id,
			amount
		});
	}

	public setHealing(target: Character, amount: number) {
		this.healing += amount;

		this.events.push({
			type: 'HEALING',
			target: target.data.id,
			amount
		});
	}

	public setRevive(target: Character) {
		const amount = 1;
		this.revives += amount;

		this.events.push({
			type: 'REVIVE',
			target: target.data.id,
			amount
		});
	}

	public serialize(): IScore {
		return {
			damage: this.damage,
			healing: this.healing,
			kills: this.kills,
			revives: this.revives,
			events: this.events
		};
	}
}

export default Score;
