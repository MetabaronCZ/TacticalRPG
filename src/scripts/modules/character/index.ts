import Sexes from 'data/sexes';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Archetypes from 'data/archetypes';
import { characterCTLimit, mpRegen } from 'data/game-config';

import Tile from 'modules/geometry/tile';
import AIPlayer from 'modules/ai/player';
import Player from 'modules/battle/player';
import Score from 'modules/character/score';
import { ISexData } from 'modules/character/sex';
import Skillset from 'modules/character/skillset';
import StatusEffect from 'modules/character/status';
import Attributes from 'modules/character/attributes';
import { DirectionID } from 'modules/geometry/direction';
import { IArmorData } from 'modules/equipment/armor-data';
import { IOnBattleInfo } from 'modules/battle/battle-info';
import { IWeaponData } from 'modules/equipment/weapon-data';
import { IArchetypeData } from 'modules/character/archetype';
import { StatusEffectID } from 'modules/battle/status-effect';
import CharacterAction from 'modules/battle/character-action';
import BaseAttributes from 'modules/character/base-attributes';
import { SkillID, SkillCooldown } from 'modules/skill/skill-data';
import { CharacterData, ICharacterData } from 'modules/character-creation/character-data';

export type ISkillCooldowns = Partial<{
	[id in SkillID]: SkillCooldown;
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

	public score: Score;

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

		this.score = new Score();
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

	public canEvade(obstacles: Tile[] = []): boolean {
		return this.position.getSideTiles(obstacles).length > 0;
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
		const { AP, MP } = this.baseAttributes;

		// regenerate actor AP
		this.attributes.set('AP', AP);

		// regenerate actor MP
		let newMP = this.attributes.MP + MP * mpRegen;
		newMP = Math.floor(newMP);
		newMP = Math.max(0, newMP);
		newMP = Math.min(newMP, MP);

		this.attributes.set('MP', newMP);

		// update skill cooldowns
		for (const id of Object.keys(this.cooldowns) as SkillID[]) {
			const cd = this.cooldowns[id] || 0;

			if ('ULTIMATE' !== cd) {
				if (cd > 1) {
					this.cooldowns[id] = cd - 1 as SkillCooldown;
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

	public applyDamage(attacker: Character, physical: number, magical: number, mana: number, effectIds: StatusEffectID[] = []) {
		const { attributes, status } = this;

		if (this.dead || status.has('DYING')) {
			throw new Error('Cannot apply damage: dead or dying');
		}
		const damage = physical + magical;
		let newHP = attributes.HP - damage;
		let newMP = attributes.MP - mana;

		newHP = newHP > 0 ? newHP : 0;
		newMP = newMP > 0 ? newMP : 0;

		attributes.set('HP', newHP);
		attributes.set('MP', newMP);

		attacker.score.setDamage(this, damage);

		// apply damage status effects
		for (const effect of effectIds) {
			status.apply(attacker, effect, physical, magical);
		}

		// set DYING status if mortally wounded
		if (attributes.HP <= 0) {
			status.removeAll();
			status.apply(attacker, 'DYING');
			attacker.score.setKill(this);
		}
	}

	public applyHealing(healer: Character, healing: number, effectIds: StatusEffectID[] = []) {
		if (this.dead || this.status.has('DYING')) {
			throw new Error('Cannot apply healing: dead or dying');
		}
		const { HP } = this.attributes;
		const { HP: maxHP } = this.baseAttributes;

		let newHP = HP + healing;
		newHP = newHP > maxHP ? maxHP : newHP;

		const healed = newHP - HP;

		this.attributes.set('HP', newHP);
		healer.score.setHealing(this, healed);

		for (const effect of effectIds) {
			this.status.apply(healer, effect, 0, healing);
		}
	}

	public revive(healer: Character) {
		if (!this.status.has('DYING')) {
			throw new Error('Illegal character revive attempt');
		}
		this.status.removeAll();

		this.attributes.set('HP', this.baseAttributes.HP);
		this.attributes.set('CT', 0);

		healer.score.setRevive(this);
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
			this.cooldowns[skill.id] = ('ULTIMATE' === cd ? cd : cd + 1) as SkillCooldown;
		}

		// reduce AP, MP
		if (null !== cost) {
			this.attributes.set('AP', this.attributes.AP - cost.AP);
			this.attributes.set('MP', this.attributes.MP - cost.MP);
		}
	}
}

export default Character;
