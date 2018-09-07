import Player from 'engine/player';
import Position from 'engine/position';
import Status from 'engine/character/status';
import { DirectionID } from 'engine/direction';
import Movement from 'engine/character/movement';
import Equipment from 'engine/character/equipment';
import Attributes, { AttributeID } from 'engine/attributes';
import { IStatusEffect, StatusEffectID } from 'engine/status-effect';

import { ICharacterData } from 'modules/character-data/types';

class Character {
	private readonly player: Player;
	private readonly data: ICharacterData;
	private readonly attributes: Attributes;

	private readonly status: Status;
	private readonly movable: Movement;
	private readonly equipment: Equipment;

	constructor(data: ICharacterData, player: Player) {
		this.data = data;
		this.player = player;
		this.movable = new Movement();
		this.equipment = new Equipment(data);
		this.attributes = new Attributes(data.archetype);
		this.status = new Status();
	}

	public isPowerType(): boolean {
		return -1 !== this.data.archetype.indexOf('P');
	}

	public isSpeedType(): boolean {
		return -1 !== this.data.archetype.indexOf('S');
	}

	public isMagicType(): boolean {
		return -1 !== this.data.archetype.indexOf('M');
	}

	public isDead(): boolean {
		return this.getAttribute('HP') <= 0;
	}

	public getData(): ICharacterData {
		return this.data;
	}

	public getPlayer() {
		return this.player;
	}

	public getAttribute(attr: AttributeID): number {
		return this.attributes.getCurrent()[attr];
	}

	public getBaseAttribute(attr: AttributeID): number {
		return this.attributes.getBase()[attr];
	}

	public setAttribute(attr: AttributeID, value: number) {
		this.attributes.set(attr, value);
	}

	public getStatus(): IStatusEffect[] {
		return this.status.get();
	}

	public getPosition(): Position {
		return this.movable.getPosition();
	}

	public setPosition(pos: Position) {
		this.movable.setPosition(pos);
	}

	public getDirection(): DirectionID {
		return this.movable.getDirection();
	}

	public setDirection(dir: DirectionID) {
		this.movable.setDirection(dir);
	}

	public getEquipment(): Equipment {
		return this.equipment;
	}

	// updates on every engine step
	public update() {
		if (this.isDead()) {
			return;
		}
		// update CT
		const SPD = this.getAttribute('SPD');
		const CT = this.getAttribute('CT');
		this.setAttribute('CT', CT + SPD);
	}

	public applyStatus(status: StatusEffectID) {
		this.status.apply(status);
	}

	public removeStatus(status: StatusEffectID) {
		this.status.remove(status);
	}

	public applySkill(damage: number, effectIds: StatusEffectID[] = []) {
		const residualHP = this.getAttribute('HP') - damage;

		this.setAttribute('HP', residualHP > 0 ? residualHP : 0);

		for (const effect of effectIds) {
			this.status.apply(effect);
		}
	}

	public skillReduceAP(cost: number) {
		this.setAttribute('AP', this.getAttribute('AP') - cost);
	}
}

export default Character;
