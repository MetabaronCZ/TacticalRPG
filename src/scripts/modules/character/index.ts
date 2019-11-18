import Sexes from 'data/sexes';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Archetypes from 'data/archetypes';
import {
	characterCTLimit, mpRegen,
	conditionCritical, conditionDanger
} from 'data/game-config';

import Skill from 'modules/skill';
import Tile from 'modules/geometry/tile';
import AIPlayer from 'modules/ai/player';
import Status from 'modules/character/status';
import Skillset from 'modules/character/skillset';
import { ISexData, SexID } from 'modules/character/sex';
import { DirectionID } from 'modules/geometry/direction';
import { IArmorData } from 'modules/equipment/armor-data';
import { OnBattleInfo } from 'modules/battle/battle-info';
import { IWeaponData } from 'modules/equipment/weapon-data';
import Command, { formatCost } from 'modules/battle/command';
import BaseAttributes from 'modules/character/base-attributes';
import SkillAnimation from 'modules/battle/act/skill-animation';
import Player, { IPlayerSnapshot } from 'modules/battle/player';
import { SkillID, SkillCooldown } from 'modules/skill/skill-data';
import { IArchetypeData, ArchetypeID } from 'modules/character/archetype';
import { ICharacterData } from 'modules/character-creation/character-data';
import Attributes, { AttributeID, IAttributes } from 'modules/character/attributes';
import StatusEffect, { StatusEffectID, OnStatus } from 'modules/battle/status-effect';

export type CharacterCondition = 'OK' | 'DANGER' | 'CRITICAL';

export type ISkillCooldowns = Partial<{
	[id in SkillID]: SkillCooldown;
}>;

export interface ICharacterSnapshot {
	readonly data: ICharacterData;
	readonly player: IPlayerSnapshot;

	readonly battleId: string;
	readonly name: string;
	readonly sex: SexID;
	readonly skillset: Skillset;
	readonly archetype: ArchetypeID;
	readonly attributes: IAttributes;
	readonly baseAttributes: IAttributes;

	readonly isAI: boolean;
	readonly dead: boolean;
	readonly dying: boolean;
	readonly canAct: boolean;
	readonly canMove: boolean;
	readonly status: StatusEffect[];
	readonly cooldowns: ISkillCooldowns;
	readonly condition: CharacterCondition;
	readonly animation: SkillAnimation | null;

	readonly mainHand: IWeaponData;
	readonly offHand: IWeaponData;
	readonly armor: IArmorData;

	readonly position: Tile;
	readonly direction: DirectionID;
}

class Character {
	public readonly battleId: string;
	public readonly data: ICharacterData;
	public readonly name: string;
	public readonly sex: ISexData;
	public readonly archetype: IArchetypeData;
	public readonly skillset: Skillset;
	public readonly player: Player;

	public readonly status: Status;
	public readonly attributes: Attributes;
	public readonly baseAttributes: BaseAttributes;
	
	public readonly mainHand: IWeaponData;
	public readonly offHand: IWeaponData;
	public readonly armor: IArmorData;

	public position: Tile;
	public direction: DirectionID;
	public cooldowns: ISkillCooldowns = {}; // skill cooldowns
	public animation: SkillAnimation | null = null; // active Skill animation

	private dead = false;

	constructor(character: ICharacterData, position: Tile, direction: DirectionID, player: Player) {
		const data = { ...character };

		this.battleId = `${data.id}-${player.id}`;
		this.data = data;
		this.name = data.name;
		this.player = player;

		this.sex = Sexes.get(data.sex);
		this.archetype = Archetypes.get(data.archetype);
		this.skillset = new Skillset(data.skillset, data.archetype);

		this.mainHand = Weapons.get(data.main);
		this.offHand = Weapons.get(data.off);
		this.armor = Armors.get(data.armor);

		this.status = new Status();
		this.attributes = new Attributes(this);
		this.baseAttributes = new BaseAttributes(this);

		this.position = position;
		this.direction = direction;
	}

	public static from(char: ICharacterSnapshot, player: Player): Character {
		const character = new Character(char.data, char.position, char.direction, player);

		for (const status of char.status) {
			character.status.apply(status.id);
		}

		for (const id in char.attributes) {
			const attr = id as AttributeID;
			character.attributes.set(attr, char.attributes[attr]);
		}

		for (const id in char.cooldowns) {
			const cd = id as SkillID;
			character.cooldowns[cd] = char.cooldowns[cd];
		}
	
		if (char.dead) {
			character.die();
		}

		return character;
	}

	public serialize(): ICharacterSnapshot {
		return {
			battleId: this.battleId,
			data: { ...this.data },
			name: this.data.name,
			sex: this.data.sex,
			skillset: this.skillset,
			archetype: this.data.archetype,
			attributes: this.attributes.serialize(),
			baseAttributes: this.baseAttributes.serialize(),
			isAI: this.isAI(),
			dead: this.dead,
			dying: this.status.has('DYING'),
			canAct: this.canAct(),
			canMove: this.canMove(),
			status: this.status.get(),
			condition: this.getCondition(),
			cooldowns: { ...this.cooldowns },
			animation: this.animation,
			player: this.player.serialize(),
			position: this.position,
			direction: this.direction,
			mainHand: this.mainHand,
			offHand: this.offHand,
			armor: this.armor
		};
	}

	public isDead(): boolean {
		return this.dead;
	}

	public isAI(): boolean {
		return this.player instanceof AIPlayer;
	}

	public canAct(): boolean {
		const status = this.status;
		return (
			!this.dead && !status.has('DYING') &&
			!status.has('STUN') && !status.has('FREEZE')
		);
	}

	public canMove(): boolean {
		const status = this.status;
		return this.canAct() && !status.has('CRIPPLE');
	}

	public canEvade(obstacles: Tile[] = []): boolean {
		return this.position.getNeighbours(obstacles).length > 0;
	}

	public getCondition(): CharacterCondition {
		const { HP } = this.attributes;
		const { HP: baseHP } = this.baseAttributes;

		if (HP < baseHP * conditionCritical) {
			return 'CRITICAL';
		}
		if (HP < baseHP * conditionDanger) {
			return 'DANGER';
		}
		return 'OK';
	}

	// updates on every game tick
	public update(onInfo: OnBattleInfo): void {
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
	public startAct(): void {
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
	public endAct(): void {
		if (this.dead) {
			throw new Error('Character cannot end act: dead or dying');
		}

		// update character CT
		const { CT } = this.attributes;
		this.attributes.set('CT', CT % characterCTLimit);
	}

	public onDamage(damage: number, mana: number, effects: StatusEffectID[], onStatus: OnStatus): void {
		const { attributes, status } = this;

		if (this.dead || status.has('DYING')) {
			throw new Error('Cannot apply damage: dead or dying');
		}
		let newHP = attributes.HP - damage;
		let newMP = attributes.MP - mana;

		newHP = newHP > 0 ? newHP : 0;
		newMP = newMP > 0 ? newMP : 0;

		attributes.set('HP', newHP);
		attributes.set('MP', newMP);

		onStatus(damage);

		// apply damage status effects
		for (const effect of effects) {
			status.apply(effect, damage, onStatus);
		}

		// set DYING status if mortally wounded
		if (attributes.HP <= 0) {
			status.removeAll();
			status.apply('DYING');
			onStatus(0, true);
		}
	}

	public onHealing(healing: number, effects: StatusEffectID[] = [], onStatus: OnStatus): void {
		if (this.dead || this.status.has('DYING')) {
			throw new Error('Cannot apply healing: dead or dying');
		}
		const { HP } = this.attributes;
		const { HP: maxHP } = this.baseAttributes;

		let newHP = HP + healing;
		newHP = newHP > maxHP ? maxHP : newHP;

		const healed = newHP - HP;

		this.attributes.set('HP', newHP);
		onStatus(healed);

		for (const effect of effects) {
			this.status.apply(effect, healing, onStatus);
		}
	}

	public onRevive(onStatus: OnStatus): void {
		if (!this.status.has('DYING')) {
			throw new Error('Illegal character revive attempt');
		}
		const { HP } = this.baseAttributes;
		this.status.removeAll();

		this.attributes.set('HP', HP);
		this.attributes.set('CT', 0);
		onStatus(HP, true);
	}

	public die(): void {
		this.status.removeAll();
		this.dead = true;
	}

	public act(command: Command): void {
		const { cost, skills } = command;

		// reduce AP, MP
		if (cost) {
			const { AP, MP } = this.attributes;
			const newAP = AP - cost.AP;
			const newMP = MP - cost.MP;

			if (newAP < 0 || newMP < 0) {
				throw new Error('Character could not act: invalid command cost ' + formatCost(cost));
			}
			this.attributes.set('AP', newAP);
			this.attributes.set('MP', newMP);
		}
		const cdSkills = [...skills];

		if ('DOUBLE_ATTACK' === command.type) {
			const doubleAttack = new Skill('DOUBLE_ATTACK');
			cdSkills.push(doubleAttack);
		}

		// put skills on cooldown
		for (const skill of cdSkills) {
			const cd = skill.cooldown;
			this.cooldowns[skill.id] = ('ULTIMATE' === cd ? cd : cd + 1) as SkillCooldown;
		}
	}
}

export default Character;
