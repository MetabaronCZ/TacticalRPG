import StatusEffects from 'data/status-effects';
import { IStatusEffect, StatusEffectID } from 'engine/battle/status-effect';

class Status {
	private items: IStatusEffect[] = [];

	public has(effectId: StatusEffectID): boolean {
		return !!this.items.find(item => effectId === item.id);
	}

	public get(): IStatusEffect[] {
		return this.items;
	}

	public apply(effectId: StatusEffectID) {
		const effect = StatusEffects.get(effectId);
		this.items.push(effect());
	}

	public remove(effectId: StatusEffectID) {
		for (let i = 0, imax = this.items.length; i < imax; i++) {
			if (this.items[i].id === effectId) {
				this.items.splice(i, 1);
				return;
			}
		}
	}
}

export default Status;
