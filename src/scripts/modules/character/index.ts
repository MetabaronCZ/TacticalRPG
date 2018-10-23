import { characterCTLimit } from 'data/game-config';

import Armor from 'modules/equipment/armor';
import Weapon from 'modules/equipment/weapon';
import StatusEffect from 'modules/character/status';
import Position from 'modules/geometry/position';
import Skillset from 'modules/character/skillset';
import Attributes from 'modules/character/attributes';
import { DirectionID } from 'modules/geometry/direction';
import { IArchetypeData } from 'modules/character/archetype';
import { StatusEffectID } from 'modules/battle/status-effect';
import BaseAttributes from 'modules/character/base-attributes';
import { CharacterData } from 'modules/character-creation/character-data';
import Archetypes from 'data/archetypes';

class Character {
	public readonly name: string;
	public readonly sex: string;
	public readonly attributes: Attributes;
	public readonly archetype: IArchetypeData;
	public readonly baseAttributes: BaseAttributes;

	public readonly player: number;
	public readonly skillset: Skillset;
	public readonly status: StatusEffect;

	public readonly mainHand: Weapon;
	public readonly offHand: Weapon;
	public readonly armor: Armor;

	public position: Position;
	public direction: DirectionID;

	constructor(character: CharacterData, position: Position, direction: DirectionID, player: number) {
		const data = character.serialize();

		this.name = data.name;
		this.sex = data.sex;
		this.archetype = Archetypes.get(data.archetype);
		this.attributes = new Attributes(data.archetype);
		this.baseAttributes = new BaseAttributes(data.archetype);

		this.player = player;
		this.skillset = new Skillset(data.skillset, data.archetype);
		this.status = new StatusEffect();

		this.mainHand = new Weapon(data.main);
		this.offHand = new Weapon(data.off);
		this.armor = new Armor(data.armor);

		this.position = position;
		this.direction = direction;
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
