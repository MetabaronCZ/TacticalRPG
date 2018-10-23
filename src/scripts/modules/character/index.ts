import Sexes from 'data/sexes';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Archetypes from 'data/archetypes';
import { characterCTLimit } from 'data/game-config';

import { ISexData } from 'modules/character/sex';
import Position from 'modules/geometry/position';
import Skillset from 'modules/character/skillset';
import StatusEffect from 'modules/character/status';
import Attributes from 'modules/character/attributes';
import { DirectionID } from 'modules/geometry/direction';
import { IArmorData } from 'modules/equipment/armor-data';
import { IWeaponData } from 'modules/equipment/weapon-data';
import { IArchetypeData } from 'modules/character/archetype';
import { StatusEffectID } from 'modules/battle/status-effect';
import BaseAttributes from 'modules/character/base-attributes';
import { CharacterData } from 'modules/character-creation/character-data';

class Character {
	public readonly name: string;
	public readonly sex: ISexData;
	public readonly archetype: IArchetypeData;

	public readonly attributes: Attributes;
	public readonly baseAttributes: BaseAttributes;

	public readonly player: number;
	public readonly skillset: Skillset;
	public readonly status: StatusEffect;

	public readonly mainHand: IWeaponData;
	public readonly offHand: IWeaponData;
	public readonly armor: IArmorData;

	public position: Position;
	public direction: DirectionID;

	constructor(character: CharacterData, position: Position, direction: DirectionID, player: number) {
		const data = character.serialize();

		this.name = data.name;
		this.sex = Sexes.get(data.sex);
		this.archetype = Archetypes.get(data.archetype);

		this.skillset = new Skillset(data.skillset, data.archetype);

		this.mainHand = Weapons.get(data.main);
		this.offHand = Weapons.get(data.off);
		this.armor = Armors.get(data.armor);

		this.player = player;

		this.attributes = new Attributes(data.archetype);
		this.baseAttributes = new BaseAttributes(data.archetype);

		this.position = position;
		this.direction = direction;
		this.status = new StatusEffect();
	}

	public isDead(): boolean {
		return this.attributes.HP <= 0;
	}

	// updates on every game tick
	public update() {
		if (this.isDead()) {
			return;
		}
		// update CT
		const { SPD, CT } = this.attributes;
		this.attributes.set('CT', CT + SPD);
	}

	// update on character act start
	public startAct() {
		if (this.isDead()) {
			throw new Error('Character cannot start act: dead state');
		}
		// regenerate actor AP
		const { AP } = this.baseAttributes;
		this.attributes.set('AP', AP);
	}

	// update on character act end
	public endAct() {
		if (this.isDead()) {
			throw new Error('Character cannot end act: dead state');
		}
		// update character CT
		const { CT } = this.attributes;
		this.attributes.set('CT', CT % characterCTLimit);
	}

	public applySkill(damage: number, effectIds: StatusEffectID[] = []) {
		const residualHP = this.attributes.HP - damage;

		this.attributes.set('HP', residualHP > 0 ? residualHP : 0);

		for (const effect of effectIds) {
			this.status.apply(effect);
		}
	}

	public skillReduceAP(cost: number) {
		this.attributes.set('AP', this.attributes.AP - cost);
	}
}

export default Character;
