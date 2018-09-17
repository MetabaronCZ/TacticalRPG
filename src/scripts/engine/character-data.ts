import uuid from 'uuid/v1';

import Weapons from 'data/weapons';

import { SexID } from 'engine/character/sex';
import { IEquipSlot } from 'engine/equipment/wield';
import { ArmorID } from 'engine/equipment/armor-data';
import { IIndexableData } from 'engine/indexable-data';
import { WeaponID } from 'engine/equipment/weapon-data';
import { ArchetypeID } from 'engine/character/archetype';
import { SkillsetID } from 'engine/character/skillset-data';
import { checkMainHand, checkOffHand, checkWeaponWield, checkArmorArchetype } from 'engine/utils/equipment';
import Armors from 'data/armors';

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

export class CharacterData {
	public readonly id: string;
	public readonly creationDate: number;
	public readonly lastUpdate: number;
	private name: string;
	private sex: SexID;
	private archetype: ArchetypeID;
	private skillset: SkillsetID;
	private main: WeaponID;
	private off: WeaponID;
	private armor: ArmorID;

	constructor(conf: Partial<ICharacterData> = {}) {
		const now = Date.now();

		const indexableDefaults: IIndexableData = {
			id: uuid(),
			creationDate: now,
			lastUpdate: now
		};
		const data: ICharacterData = Object.assign({}, defaults, indexableDefaults, conf);

		this.id = data.id;
		this.creationDate = data.creationDate;
		this.lastUpdate = data.lastUpdate;
		this.name = data.name;
		this.sex = data.sex;
		this.archetype = data.archetype;
		this.skillset = data.skillset;
		this.main = data.main;
		this.off = data.off;
		this.armor = data.armor;
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
		return checkWeaponWield(this.main, 'BOTH');
	}

	public isDualWielding = (): boolean => {
		return checkWeaponWield(this.main, 'DUAL');
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
		const { archetype, main } = this;
		const weapons: WeaponID[] = [];

		Weapons.each(id => {
			switch (slot) {
				case 'MAIN':
					if (checkMainHand(id, archetype)) {
						weapons.push(id);
					}
					return;

				case 'OFF':
					if (checkOffHand(id, archetype, main)) {
						weapons.push(id);
					}
					return;

				default:
					throw new Error(`Invalid equip slot: ${slot}`);
			}
		});

		return cb ? weapons.filter(cb) : weapons;
	}

	public filterArmors(cb?: IArmorFilterCb): ArmorID[] {
		const { archetype } = this;
		const armors: ArmorID[] = [];

		Armors.each(id => {
			if (checkArmorArchetype(id, archetype)) {
				armors.push(id);
			}
		});

		return cb ? armors.filter(cb) : armors;
	}

	public serialize(): ICharacterData {
		return {
			id: this.id,
			creationDate: this.creationDate,
			lastUpdate: this.lastUpdate,
			name: this.name,
			sex: this.sex,
			archetype: this.archetype,
			skillset: this.skillset,
			main: this.main,
			off: this.off,
			armor: this.armor
		};
	}
}
