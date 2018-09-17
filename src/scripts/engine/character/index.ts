import { characterCTLimit } from 'data/game-config';

import Position from 'engine/position';
import Armor from 'engine/equipment/armor';
import Weapon from 'engine/equipment/weapon';
import Status from 'engine/character/status';
import { DirectionID } from 'engine/direction';
import Skillset from 'engine/character/skillset';
import { StatusEffectID } from 'engine/status-effect';
import { ICharacterData } from 'engine/character-data';
import { ArchetypeID } from 'engine/character/archetype';
import Attributes from 'engine/character/attributes/attributes';
import BaseAttributes from 'engine/character/attributes/base-attributes';

class Character {
	public readonly name: string;
	public readonly sex: string;
	public readonly archetype: ArchetypeID;
	public readonly attributes: Attributes;
	public readonly baseAttributes: BaseAttributes;

	public readonly player: number;
	public readonly skillset: Skillset;
	public readonly status: Status;

	public readonly mainHand: Weapon;
	public readonly offHand: Weapon;
	public readonly armor: Armor;

	public position: Position;
	public direction: DirectionID;

	constructor(data: ICharacterData, position: Position, direction: DirectionID, player: number) {
		this.name = data.name;
		this.sex = data.sex;
		this.archetype = data.archetype;
		this.attributes = new Attributes(data.archetype);
		this.baseAttributes = new BaseAttributes(data.archetype);

		this.player = player;
		this.skillset = new Skillset(data.skillset);
		this.status = new Status();

		this.mainHand = new Weapon(data.main);
		this.offHand = new Weapon(data.off);
		this.armor = new Armor(data.armor);

		this.position = position;
		this.direction = direction;
	}

	public isPowerType(): boolean {
		return -1 !== this.archetype.indexOf('P');
	}

	public isSpeedType(): boolean {
		return -1 !== this.archetype.indexOf('S');
	}

	public isMagicType(): boolean {
		return -1 !== this.archetype.indexOf('M');
	}

	public isDead(): boolean {
		return this.attributes.get('HP') <= 0;
	}

	// updates on every game tick
	public update() {
		if (this.isDead()) {
			return;
		}
		// update CT
		const SPD = this.attributes.get('SPD');
		const CT = this.attributes.get('CT');
		this.attributes.set('CT', CT + SPD);
	}

	// update on character act start
	public startAct() {
		if (this.isDead()) {
			throw new Error('Character cannot start act: dead state');
		}
		// regenerate actor AP
		const baseAP = this.baseAttributes.get('AP');
		this.attributes.set('AP', baseAP);
	}

	// update on character act end
	public endAct() {
		if (this.isDead()) {
			throw new Error('Character cannot end act: dead state');
		}
		// update character CT
		const CT = this.attributes.get('CT');
		this.attributes.set('CT', CT % characterCTLimit);
	}

	public applySkill(damage: number, effectIds: StatusEffectID[] = []) {
		const residualHP = this.attributes.get('HP') - damage;

		this.attributes.set('HP', residualHP > 0 ? residualHP : 0);

		for (const effect of effectIds) {
			this.status.apply(effect);
		}
	}

	public skillReduceAP(cost: number) {
		this.attributes.set('AP', this.attributes.get('AP') - cost);
	}
}

export default Character;
