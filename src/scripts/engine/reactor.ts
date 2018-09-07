import Position from 'engine/position';
import Character from 'engine/character';
import { StatusEffectID } from 'engine/status-effect';

class Reactor {
	private readonly character: Character;
	private evasionTarget: Position|null = null; // selected evasion tile position
	private evasionArea: Position[] = []; // possible evasion positions of reacting character

	constructor(character: Character) {
		this.character = character;
	}

	public isDead(): boolean {
		return this.character.isDead();
	}

	public getCharacter(): Character {
		return this.character;
	}

	public getEvasionTarget(): Position|null {
		return this.evasionTarget;
	}

	public getEvasionArea(): Position[] {
		return this.evasionArea;
	}

	public getPosition(): Position {
		return this.character.getPosition();
	}

	public startEvasion(targets: Position[] = []) {
		this.evasionArea = targets;
	}

	public applyStatus(statusId: StatusEffectID) {
		this.character.applyStatus(statusId);
	}

	public evade(position: Position, cost: number) {
		const char = this.character;
		const AP = char.getAttribute('AP');
		char.setPosition(position);
		char.setAttribute('AP', AP - cost);
	}
}

export default Reactor;
