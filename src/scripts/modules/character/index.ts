import Sexes from 'data/sexes';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Archetypes from 'data/archetypes';
import {
	characterCTLimit, mpRegen,
	conditionCritical, conditionDanger
} from 'data/game-config';

import Tile from 'modules/geometry/tile';
import AIPlayer from 'modules/ai/player';
import Player from 'modules/battle/player';
import Command from 'modules/battle/command';
import Status from 'modules/character/status';
import Skillset from 'modules/character/skillset';
import { ISexData, SexID } from 'modules/character/sex';
import { DirectionID } from 'modules/geometry/direction';
import { IArmorData } from 'modules/equipment/armor-data';
import { IOnBattleInfo } from 'modules/battle/battle-info';
import { IWeaponData } from 'modules/equipment/weapon-data';
import BaseAttributes from 'modules/character/base-attributes';
import { SkillID, SkillCooldown } from 'modules/skill/skill-data';
import { IArchetypeData, ArchetypeID } from 'modules/character/archetype';
import Attributes, { AttributeID, IAttributes } from 'modules/character/attributes';
import StatusEffect, { StatusEffectID, IOnStatus } from 'modules/battle/status-effect';
import { CharacterData, ICharacterData } from 'modules/character-creation/character-data';
import { PlayerData } from 'modules/battle-configuration/player-data';

type CharacterCondition = 'OK' | 'DANGER' | 'CRITICAL';

export type ISkillCooldowns = Partial<{
	[id in SkillID]: SkillCooldown;
}>;

export interface ICharacter {
	readonly id: string;
	readonly name: string;
	readonly sex: SexID;
	readonly skillset: Skillset;
	readonly archetype: ArchetypeID;
	readonly attributes: IAttributes;
	readonly baseAttributes: IAttributes;
	readonly dead: boolean;
	readonly dying: boolean;
	readonly player: number;
	readonly status: StatusEffect[];
	readonly cooldowns: ISkillCooldowns;

	readonly mainHand: IWeaponData;
	readonly offHand: IWeaponData;
	readonly armor: IArmorData;

	readonly position: Tile;
	readonly direction: DirectionID;
}

class Character {
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

	private dead = false;

	constructor(character: CharacterData, position: Tile, direction: DirectionID, player: Player) {
		const data = character.serialize();

		this.data = data;
		this.name = data.name;
		this.sex = Sexes.get(data.sex);
		this.archetype = Archetypes.get(data.archetype);
		this.skillset = new Skillset(data.skillset, data.archetype);
		this.player = player;

		this.status = new Status();
		this.attributes = new Attributes(this);
		this.baseAttributes = new BaseAttributes(this);

		this.mainHand = Weapons.get(data.main);
		this.offHand = Weapons.get(data.off);
		this.armor = Armors.get(data.armor);

		this.position = position;
		this.direction = direction;
	}

	public static from(data: ICharacter): Character {
		const playerData = new PlayerData(data.player, { name: 'SYSTEM' });
		const player = new Player(playerData, []);

		const charData = new CharacterData({
			id: data.id,
			name: data.name,
			sex: data.sex,
			archetype: data.archetype,
			skillset: data.skillset.id,
			main: data.mainHand.id,
			off: data.offHand.id,
			armor: data.armor.id
		});

		const char = new Character(charData, data.position, data.direction, player);

		for (const status of data.status) {
			char.status.apply(status.id);
		}

		for (const id in data.attributes) {
			const attr = id as AttributeID;
			char.attributes.set(attr, data.attributes[attr]);
		}

		for (const id in data.cooldowns) {
			const cd = id as SkillID;
			char.cooldowns[cd] = data.cooldowns[cd];
		}
	
		if (data.dead) {
			char.die();
		}

		return char;
	}

	public serialize(): ICharacter {
		return {
			id: this.data.id,
			name: this.name,
			sex: this.data.sex,
			skillset: this.skillset,
			archetype: this.archetype.id,
			attributes: this.attributes.serialize(),
			baseAttributes: this.baseAttributes.serialize(),
			dead: this.dead,
			dying: this.status.has('DYING'),
			status: this.status.get(),
			cooldowns: { ...this.cooldowns },
			player: this.player.id,
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
		return !this.dead && !status.has('DYING') && !status.has('STUN') && !status.has('FREEZE');
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
	public update(onInfo: IOnBattleInfo): void {
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

	public onDamage(damage: number, mana: number, effects: StatusEffectID[], onStatus: IOnStatus): void {
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

	public onHealing(healing: number, effects: StatusEffectID[] = [], onStatus: IOnStatus): void {
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

	public onRevive(onStatus: IOnStatus): void {
		if (!this.status.has('DYING')) {
			throw new Error('Illegal character revive attempt');
		}
		this.status.removeAll();

		this.attributes.set('HP', this.baseAttributes.HP);
		this.attributes.set('CT', 0);
		onStatus(0, true);
	}

	public die(): void {
		this.status.removeAll();
		this.dead = true;
	}

	public act(command: Command): void {
		const { cost, skills } = command;

		// put skills on cooldown
		for (const skill of skills) {
			const cd = skill.cooldown;
			this.cooldowns[skill.id] = ('ULTIMATE' === cd ? cd : cd + 1) as SkillCooldown;
		}

		// reduce AP, MP
		if (cost) {
			this.attributes.set('AP', this.attributes.AP - cost.AP);
			this.attributes.set('MP', this.attributes.MP - cost.MP);
		}
	}
}

export default Character;
