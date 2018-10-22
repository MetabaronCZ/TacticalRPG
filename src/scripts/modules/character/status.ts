import StatusEffects from 'data/status-effects';
import { IStatusEffect, StatusEffectID } from 'modules/battle/status-effect';

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
		this.items = this.items.filter(item => item.id !== effectId);
	}
}

export default Status;
