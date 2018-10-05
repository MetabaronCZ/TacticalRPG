import { computed, action, observable } from 'mobx';

import * as ArrayUtils from 'core/array';
import { validationRules } from 'utils/validation';

import Sexes from 'data/sexes';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Skillsets from 'data/skillsets';
import Archetypes from 'data/archetypes';
import { characterMaxNameLength } from 'data/game-config';
import {
	WeaponEquipTableArch, WeaponEquipTableWield,
	WieldIndexTable, ArmorEquipTableArch,
	ArchetypeIndexTable, safeOffHand
} from 'data/equipment';

import { SexID, ISexData } from 'engine/character/sex';
import { IEquipSlot, WieldID } from 'engine/equipment/wield';
import { ArmorID, IArmorData } from 'engine/equipment/armor-data';
import { WeaponID, IWeaponData } from 'engine/equipment/weapon-data';
import { ArchetypeID, IArchetypeData } from 'engine/character/archetype';
import { SkillsetID, ISkillsetData } from 'engine/character/skillset-data';
import { IIndexableData, IndexableData } from 'engine/indexable-data';

export interface ICharacterConfig {
	readonly name: string;
	readonly sex: SexID;
	readonly archetype: ArchetypeID;
	readonly skillset: SkillsetID;
	readonly main: WeaponID;
	readonly off: WeaponID;
	readonly armor: ArmorID;
}

export type ICharacterDataEditable = keyof ICharacterConfig;
export type ICharacterData = IIndexableData & ICharacterConfig;

type IWeaponFilterCb = (id: WeaponID, i: number) => boolean;
type IArmorFilterCb = (id: ArmorID, i: number) => boolean;

export class CharacterData extends IndexableData {
	@observable private data = {
		name: '?????',
		sex: Sexes.get('MALE'),
		archetype: Archetypes.get('PP'),
		skillset: Skillsets.get('NONE'),
		main: Weapons.get('NONE'),
		off: Weapons.get('NONE'),
		armor: Armors.get('NONE')
	};

	constructor(conf: Partial<ICharacterData> = {}) {
		super({
			id: conf.id,
			creationDate: conf.creationDate,
			lastUpdate: conf.lastUpdate
		});

		const data = Object.assign({}, conf) as ICharacterData;

		for (const attr of ['name', 'sex', 'archetype', 'skillset', 'main', 'off', 'armor']) {
			const a = attr as ICharacterDataEditable;
			this.set(a, data[a]);
		}
	}

	public static getRandom(name: string): CharacterData {
		const character = new CharacterData({
			name,
			sex: Sexes.getRandomID(),
			archetype: Archetypes.getRandomID(),
			skillset: 'NONE',
			main: 'NONE',
			off: 'NONE',
			armor: 'NONE'
		});

		if (character.isMagicType()) {
			const skillsets = Skillsets.filter(([id, set]) => id !== 'NONE');
			const skillset = ArrayUtils.getRandomItem(skillsets)[0];
			character.setSkillset(skillset);
		}
		const mainHands = character.filterWeapons('MAIN', id => id !== 'NONE');
		const mainHand = ArrayUtils.getRandomItem(mainHands);
		character.setMainHand(mainHand);

		if (!character.isBothWielding() && !character.isDualWielding()) {
			const offHands = character.filterWeapons('OFF', id => id !== 'NONE');
			const offHand = ArrayUtils.getRandomItem(offHands);
			character.setOffHand(offHand || 'NONE');
		}
		const armors = character.filterArmors(id => id !== 'NONE');
		const armor = ArrayUtils.getRandomItem(armors);
		character.setArmor(armor || 'NONE');

		return character;
	}

	public isValid(): boolean {
		const { name, skillset, main, off, armor } = this.data;
		return (
			(name.length > 0 && name.length <= characterMaxNameLength) &&
			(!validationRules.name || validationRules.name.test(name)) &&
			(this.isMagicType() || skillset.id === 'NONE') &&
			this.canWieldWeapon(main.id, 'MAIN') &&
			this.canWieldWeapon(off.id, 'OFF') &&
			this.canWieldArmor(armor.id)
		);
	}

	public isPowerType(): boolean {
		return -1 !== this.data.archetype.id.indexOf('P');
	}

	public isSpeedType(): boolean {
		return -1 !== this.data.archetype.id.indexOf('S');
	}

	public isMagicType(): boolean {
		return -1 !== this.data.archetype.id.indexOf('M');
	}

	public isBothWielding = (): boolean => {
		return this.checkWeaponWield(this.data.main.id, 'BOTH');
	}

	public isDualWielding = (): boolean => {
		return this.checkWeaponWield(this.data.main.id, 'DUAL');
	}

	@computed
	public get name(): string {
		return this.data.name;
	}

	@computed
	public get sex(): ISexData {
		return this.data.sex;
	}

	@computed
	public get archetype(): IArchetypeData {
		return this.data.archetype;
	}

	@computed
	public get skillset(): ISkillsetData {
		return this.data.skillset;
	}

	@computed
	public get mainHand(): IWeaponData {
		return this.data.main;
	}

	@computed
	public get offHand(): IWeaponData {
		return this.data.off;
	}

	@computed
	public get armor(): IArmorData {
		return this.data.armor;
	}

	@action
	public setName(name: string) {
		this.data.name = name;
	}

	@action
	public setSex(id: SexID) {
		this.data.sex = Sexes.get(id);
	}

	@action
	public setArchetype(id: ArchetypeID) {
		this.data.archetype = Archetypes.get(id);
	}

	@action
	public setSkillset(id: SkillsetID) {
		if ('NONE' === id || this.isMagicType()) {
			this.data.skillset = Skillsets.get(id);
		}
	}

	@action
	public setMainHand(id: WeaponID) {
		if (this.canWieldWeapon(id, 'MAIN')) {
			this.data.main = Weapons.get(id);
		}
	}

	@action
	public setOffHand(id: WeaponID) {
		if (this.canWieldWeapon(id, 'OFF')) {
			this.data.main = Weapons.get(id);
		}
	}

	@action
	public setArmor(id: ArmorID) {
		if (this.canWieldArmor(id)) {
			this.data.armor = Armors.get(id);
		}
	}

	@action
	public set(field: ICharacterDataEditable, value: string) {
		switch (field) {
			case 'name': return this.setName(value);
			case 'sex': return this.setSex(value as SexID);
			case 'archetype': return this.setArchetype(value as ArchetypeID);
			case 'skillset': return this.setSkillset(value as SkillsetID);
			case 'main': return this.setMainHand(value as WeaponID);
			case 'off': return this.setOffHand(value as WeaponID);
			case 'armor': return this.setArmor(value as ArmorID);
			default:
				throw new Error(`Field "${field}" is not editable`);
		}
	}

	public filterWeapons(slot: IEquipSlot, cb?: IWeaponFilterCb): WeaponID[] {
		const equipable = Weapons
			.filter(id => this.canWieldWeapon(id, slot))
			.map(([id, weapon]) => id);

		return cb ? equipable.filter(cb) : equipable;
	}

	public filterArmors(cb?: IArmorFilterCb): ArmorID[] {
		const equipable = Armors
			.filter(id => this.canWieldArmor(id))
			.map(([id, armor]) => id);

		return cb ? equipable.filter(cb) : equipable;
	}

	public canWieldWeapon(weapon: WeaponID, slot: IEquipSlot): boolean {
		if ('NONE' === weapon) {
			return true;
		}
		if (!this.checkWeaponArchetype(weapon)) {
			return false;
		}
		switch (slot) {
			case 'MAIN':
				return (
					this.checkWeaponWield(weapon, 'MAIN') ||
					this.checkWeaponWield(weapon, 'BOTH') ||
					this.checkWeaponWield(weapon, 'DUAL')
				);

			case 'OFF':
				return (
					this.checkWeaponWield(weapon, 'OFF') &&
					!this.isBothWielding() &&
					!this.isDualWielding() &&
					('MM' !== this.data.archetype.id || -1 !== safeOffHand.indexOf(weapon))
				);

			default:
				throw new Error('Invalid equip slot given');
		}
	}

	public canWieldArmor(armor: ArmorID): boolean {
		if ('NONE' === armor) {
			return true;
		}
		return this.checkArmorArchetype(armor);
	}

	public serialize(): ICharacterData {
		const { data } = this;
		return {
			...super.serialize(),
			name: data.name,
			sex: data.sex.id,
			archetype: data.archetype.id,
			skillset: data.skillset.id,
			main: data.main.id,
			off: data.off.id,
			armor: data.armor.id
		};
	}

	private checkWeaponArchetype(weapon: WeaponID): boolean {
		return 1 === WeaponEquipTableArch[weapon][ArchetypeIndexTable[this.data.archetype.id]];
	}

	private checkWeaponWield(weapon: WeaponID, wield: WieldID): boolean {
		return 1 === WeaponEquipTableWield[weapon][WieldIndexTable[wield]];
	}

	private checkArmorArchetype(armor: ArmorID): boolean {
		return 1 === ArmorEquipTableArch[armor][ArchetypeIndexTable[this.data.archetype.id]];
	}
}
