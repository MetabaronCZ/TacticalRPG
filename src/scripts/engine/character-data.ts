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

import { SexID } from 'engine/character/sex';
import { ArmorID } from 'engine/equipment/armor-data';
import { WeaponID } from 'engine/equipment/weapon-data';
import { ArchetypeID } from 'engine/character/archetype';
import { SkillsetID } from 'engine/character/skillset-data';
import { IEquipSlot, WieldID } from 'engine/equipment/wield';
import { IIndexableData, IndexableData } from 'engine/indexable-data';

interface ICharacterConfig {
	readonly name: string;
	readonly sex: SexID;
	readonly archetype: ArchetypeID;
	readonly skillset: SkillsetID;
	readonly main: WeaponID;
	readonly off: WeaponID;
	readonly armor: ArmorID;
}

export type ICharacterData = IIndexableData & ICharacterConfig;

type IWeaponFilterCb = (id: WeaponID, i: number) => boolean;
type IArmorFilterCb = (id: ArmorID, i: number) => boolean;

const defaults: ICharacterConfig = {
	name: '',
	sex: 'MALE',
	archetype: 'PP',
	skillset: 'NONE',
	main: 'NONE',
	off: 'NONE',
	armor: 'NONE'
};

export class CharacterData extends IndexableData {
	private name: string;
	private sex: SexID;
	private archetype: ArchetypeID;
	private skillset: SkillsetID;
	private main: WeaponID;
	private off: WeaponID;
	private armor: ArmorID;

	constructor(conf: Partial<ICharacterData> = {}) {
		super({
			id: conf.id,
			creationDate: conf.creationDate,
			lastUpdate: conf.lastUpdate
		});

		const data: ICharacterConfig = Object.assign({}, defaults, conf);

		this.name = data.name;
		this.sex = data.sex;
		this.archetype = data.archetype;
		this.skillset = data.skillset;
		this.main = data.main;
		this.off = data.off;
		this.armor = data.armor;
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
		const { name, skillset, main, off, armor } = this;
		return (
			(name.length > 0 && name.length <= characterMaxNameLength) &&
			(!validationRules.name || validationRules.name.test(name)) &&
			(this.isMagicType() || skillset === 'NONE') &&
			this.canWieldWeapon(main, 'MAIN') &&
			this.canWieldWeapon(off, 'OFF') &&
			this.canWieldArmor(armor)
		);
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

	public isBothWielding = (): boolean => {
		return this.checkWeaponWield(this.main, 'BOTH');
	}

	public isDualWielding = (): boolean => {
		return this.checkWeaponWield(this.main, 'DUAL');
	}

	public getName(): string {
		return this.name;
	}

	public getSex(): SexID {
		return this.sex;
	}

	public getArchetype(): ArchetypeID {
		return this.archetype;
	}

	public getSkillset(): SkillsetID {
		return this.skillset;
	}

	public getMainHand(): WeaponID {
		return this.main;
	}

	public getOffHand(): WeaponID {
		return this.off;
	}

	public getArmor(): ArmorID {
		return this.armor;
	}

	public setSkillset(id: SkillsetID) {
		this.skillset = id;
	}

	public setMainHand(id: WeaponID) {
		this.main = id;
	}

	public setOffHand(id: WeaponID) {
		this.off = id;
	}

	public setArmor(id: ArmorID) {
		this.armor = id;
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
					('MM' !== this.archetype || -1 !== safeOffHand.indexOf(weapon))
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
		return {
			...super.serialize(),
			name: this.name,
			sex: this.sex,
			archetype: this.archetype,
			skillset: this.skillset,
			main: this.main,
			off: this.off,
			armor: this.armor
		};
	}

	private checkWeaponArchetype(weapon: WeaponID): boolean {
		return 1 === WeaponEquipTableArch[weapon][ArchetypeIndexTable[this.archetype]];
	}

	private checkWeaponWield(weapon: WeaponID, wield: WieldID): boolean {
		return 1 === WeaponEquipTableWield[weapon][WieldIndexTable[wield]];
	}

	private checkArmorArchetype(armor: ArmorID): boolean {
		return 1 === ArmorEquipTableArch[armor][ArchetypeIndexTable[this.archetype]];
	}
}
