import Sexes from 'data/sexes';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Archetypes from 'data/archetypes';
import { characterCTLimit } from 'data/game-config';

import Tile from 'modules/geometry/tile';
import AIPlayer from 'modules/ai/player';
import Player from 'modules/battle/player';
import { ISexData } from 'modules/character/sex';
import Skillset from 'modules/character/skillset';
import StatusEffect from 'modules/character/status';
import Attributes from 'modules/character/attributes';
import { DirectionID } from 'modules/geometry/direction';
import { IArmorData } from 'modules/equipment/armor-data';
import { IOnBattleInfo } from 'modules/battle/battle-info';
import { IWeaponData } from 'modules/equipment/weapon-data';
import { IArchetypeData } from 'modules/character/archetype';
import { SkillID, Ultimate } from 'modules/skill/skill-data';
import { StatusEffectID } from 'modules/battle/status-effect';
import CharacterAction from 'modules/battle/character-action';
import BaseAttributes from 'modules/character/base-attributes';
import { CharacterData, ICharacterData } from 'modules/character-creation/character-data';

type ISkillCooldowns = Partial<{
	[id in SkillID]: number | Ultimate;
}>;

class Character {
	public readonly data: ICharacterData;
	public readonly name: string;
	public readonly sex: ISexData;
	public readonly archetype: IArchetypeData;

	public readonly attributes: Attributes;
	public readonly baseAttributes: BaseAttributes;

	public readonly player: Player;
	public readonly skillset: Skillset;
	public readonly status: StatusEffect;

	public readonly mainHand: IWeaponData;
	public readonly offHand: IWeaponData;
	public readonly armor: IArmorData;

	public position: Tile;
	public direction: DirectionID;
	public cooldowns: ISkillCooldowns = {}; // skill cooldowns

	private dead: boolean = false;

	constructor(character: CharacterData, position: Tile, direction: DirectionID, player: Player) {
		const data = character.serialize();

		this.data = data;
		this.name = data.name;
		this.sex = Sexes.get(data.sex);
		this.archetype = Archetypes.get(data.archetype);

		this.skillset = new Skillset(data.skillset, data.archetype);

		this.mainHand = Weapons.get(data.main);
		this.offHand = Weapons.get(data.off);
		this.armor = Armors.get(data.armor);

		this.player = player;

		this.attributes = new Attributes(this);
		this.baseAttributes = new BaseAttributes(this);

		this.position = position;
		this.direction = direction;
		this.status = new StatusEffect();
	}

	public isDead(): boolean {
		return this.dead;
	}

	public isAI(): boolean {
		return this.player instanceof AIPlayer;
	}

	public canAct(): boolean {
		const status = this.status;
		return !this.dead && !status.has('DYING') && !status.has('STUN') && !status.has('FREEZE');
	}

	public canMove(): boolean {
		const status = this.status;
		return this.canAct() && !status.has('CRIPPLE');
	}

	// updates on every game tick
	public update(onInfo: IOnBattleInfo) {
		if (this.dead) {
			throw new Error('Cannot update dead character');
		}

		// update status effects
		this.status.update(this, onInfo);

		// update CT
		const { SPD, CT } = this.attributes;
		this.attributes.set('CT', CT + SPD);
	}

	// update on character act start
	public startAct() {
		if (this.dead) {
			throw new Error('Character cannot start act: dead state');
		}

		// regenerate actor AP
		const { AP } = this.baseAttributes;
		this.attributes.set('AP', AP);

		// update skill cooldowns
		for (const id of Object.keys(this.cooldowns) as SkillID[]) {
			const cd = this.cooldowns[id] || 0;

			if ('ULTIMATE' !== cd) {
				if (cd > 1) {
					this.cooldowns[id] = cd - 1;
				} else {
					delete this.cooldowns[id];
				}
			}
		}
	}

	// update on character act end
	public endAct() {
		if (this.dead) {
			throw new Error('Character cannot end act: dead or dying');
		}

		// update character CT
		const { CT } = this.attributes;
		this.attributes.set('CT', CT % characterCTLimit);
	}

	public applyDamage(physical: number, magical: number, effectIds: StatusEffectID[] = []) {
		const { attributes, status } = this;

		if (this.dead || status.has('DYING')) {
			throw new Error('Cannot apply damage: dead or dying');
		}
		const { HP, ARM, ESH } = attributes;
		let newARM = ARM - physical;
		let newESH = ESH - magical;
		let newHP = HP;

		if (newARM < 0) {
			newHP += newARM;
			newARM = 0;
		}

		if (newESH < 0) {
			newHP += newESH;
			newESH = 0;
		}
		attributes.set('ARM', newARM);
		attributes.set('ESH', newESH);
		attributes.set('HP', newHP > 0 ? newHP : 0);

		// apply damage status effects
		for (const effect of effectIds) {
			status.apply(effect, physical, magical);
		}

		// set DYING status if mortally wounded
		if (attributes.HP <= 0) {
			status.removeAll();
			status.apply('DYING');
		}
	}

	public applyHealing(healing: number, effectIds: StatusEffectID[] = []) {
		if (this.dead || this.status.has('DYING')) {
			throw new Error('Cannot apply healing: dead or dying');
		}
		const newHP = this.attributes.HP + healing;
		const maxHP = this.baseAttributes.HP;

		this.attributes.set('HP', newHP < maxHP ? newHP : maxHP);

		for (const effect of effectIds) {
			this.status.apply(effect, 0, healing);
		}
	}

	public revive() {
		if (!this.status.has('DYING')) {
			throw new Error('Illegal character revive attempt');
		}
		this.status.removeAll();

		this.attributes.set('HP', this.baseAttributes.HP);
		this.attributes.set('CT', 0);
	}

	public die() {
		this.status.removeAll();
		this.dead = true;
	}

	public act(action: CharacterAction) {
		const { cost} = action;

		// put skills on cooldown
		for (const skill of action.skills) {
			const cd = skill.cooldown;
			this.cooldowns[skill.id] = ('ULTIMATE' === cd ? cd : cd + 1);
		}

		// reduce AP
		this.attributes.set('AP', this.attributes.AP - cost);
	}
}

export default Character;
