import { computed, action, observable } from 'mobx';

import { IValidation } from 'core/validation';

import Sexes from 'data/sexes';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Skillsets from 'data/skillsets';
import Archetypes from 'data/archetypes';
import { maxCharacterNameLength } from 'data/game-config';

import {
	WeaponEquipTableArch, WeaponEquipTableWield,
	WieldIndexTable, ArmorEquipTableArch,
	ArchetypeIndexTable, safeOffHand
} from 'data/equipment';

import { SexID, ISexData } from 'modules/character/sex';
import { IEquipSlot, WieldID } from 'modules/equipment/wield';
import { ArmorID, IArmorData } from 'modules/equipment/armor-data';
import { WeaponID, IWeaponData } from 'modules/equipment/weapon-data';
import { IIndexableData, IndexableData } from 'modules/indexable-data';
import { ArchetypeID, IArchetypeData } from 'modules/character/archetype';
import { SkillsetID, ISkillsetData } from 'modules/character/skillset-data';

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

export class CharacterData extends IndexableData {
	@observable private data = {
		name: '',
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

		const attrs: ICharacterDataEditable[] = ['name', 'sex', 'archetype', 'skillset', 'main', 'off', 'armor'];

		attrs.forEach(attr => {
			const value = conf[attr];

			if ('undefined' !== typeof value) {
				this.set(attr, value);
			}
		});
	}

	public validate(): IValidation<ICharacterDataEditable> {
		const { name, skillset, main, off, armor } = this.data;
		const errors: { [field in ICharacterDataEditable]?: string; } = {};

		if (name.length < 1 || name.length > maxCharacterNameLength) {
			errors.name = `Name should contain 1 to ${maxCharacterNameLength} characters`;
		}
		if (!name.match(/^[a-zA-Z0-9-_\s.]+$/)) {
			errors.name = 'Name should contain only letters, numbers, spaces or symbols (_, -, .)';
		}
		if (!this.canUseSkillset(skillset.id)) {
			errors.skillset = `Character uses invalid skillset "${skillset.title}"`;
		}
		if (!this.canWieldWeapon(main.id, 'MAIN')) {
			errors.main = `Character cannot wield "${main.title}" in main hand`;
		}
		if (!this.canWieldWeapon(off.id, 'OFF')) {
			errors.off = `Character cannot wield "${off.title}" in off hand`;
		}
		if (!this.canWieldArmor(armor.id)) {
			errors.armor = `Character cannot wield "${armor.title}"`;
		}
		return {
			isValid: (0 === Object.keys(errors).length),
			errors
		};
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
		super.update();
	}

	@action
	public setSex(id: SexID) {
		this.data.sex = Sexes.get(id);
		super.update();
	}

	@action
	public setArchetype(id: ArchetypeID) {
		this.data.archetype = Archetypes.get(id);

		if (!this.canUseSkillset(this.data.skillset.id)) {
			this.setSkillset('NONE');
		}

		if (!this.canWieldWeapon(this.data.main.id, 'MAIN')) {
			this.setMainHand('NONE');
		}

		if (!this.canWieldWeapon(this.data.off.id, 'OFF')) {
			this.setOffHand('NONE');
		}

		if (!this.canWieldArmor(this.data.armor.id)) {
			this.setArmor('NONE');
		}
		super.update();
	}

	@action
	public setSkillset(id: SkillsetID) {
		if (this.canUseSkillset(id)) {
			this.data.skillset = Skillsets.get(id);
			super.update();
		}
	}

	@action
	public setMainHand(id: WeaponID) {
		if (this.canWieldWeapon(id, 'MAIN')) {
			this.data.main = Weapons.get(id);

			if (!this.canWieldWeapon(this.data.off.id, 'OFF')) {
				this.setOffHand('NONE');
			}
			super.update();
		}
	}

	@action
	public setOffHand(id: WeaponID) {
		if (this.canWieldWeapon(id, 'OFF')) {
			this.data.off = Weapons.get(id);
			super.update();
		}
	}

	@action
	public setArmor(id: ArmorID) {
		if (this.canWieldArmor(id)) {
			this.data.armor = Armors.get(id);
			super.update();
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

	public canUseSkillset(id: SkillsetID): boolean {
		return 'NONE' === id || this.isMagicType();
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
