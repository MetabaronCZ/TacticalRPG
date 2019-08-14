import Character from 'modules/character';
import { IOnBattleInfo } from 'modules/battle/battle-info';
import StatusEffect, { StatusEffectID, IOnStatus } from 'modules/battle/status-effect';

class Status {
	private items: StatusEffect[] = [];

	public has(effectId: StatusEffectID): boolean {
		return !!this.items.find(item => effectId === item.id);
	}

	public get(): StatusEffect[] {
		return [...this.items];
	}

	public apply(effectId: StatusEffectID, physical = 0, magical = 0, onStatus?: IOnStatus): void {
		const effect = new StatusEffect(effectId, physical, magical, onStatus);
		const existing = this.items.find(item => effectId === item.id);

		if (!existing) {
			// add new StatusEffect
			this.items.push(effect);
			return;
		}
		switch (existing.multi) {
			case 'RENEW':
				// reset values of existing effect
				existing.duration.value = existing.duration.max;
				existing.repeat.value = existing.repeat.max;
				return;

			case 'STACK':
				// add another stack of effect
				this.items.push(effect);
				return;

			case 'IGNORE':
				// only one instance of this effect can be active
				return;

			default:
				throw new Error('Invalid StatusEffect.multi value: ' + existing.multi);
		}
	}

	public remove(effect: StatusEffect): void {
		this.items = this.items.filter(item => effect !== item);
	}

	public removeByID(effectID: StatusEffectID): void {
		this.items = this.items.filter(item => effectID !== item.id);
	}

	public removeAll(): void {
		this.items = [];
	}

	public update(char: Character, cb: IOnBattleInfo): void {
		for (const item of this.items) {
			item.duration.value--;

			if (item.duration.value <= 0) {
				item.duration.value = item.duration.max;
				item.repeat.value--;

				if (item.apply) {
					item.apply(char, cb);
				}

				if (item.repeat.value <= 0) {
					this.remove(item);

					cb({
						text: `${item.title} ended`,
						type: 'ACTION',
						position: char.position
					});
				}
			}
		}
	}
}

export default Status;
