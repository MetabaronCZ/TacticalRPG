import uuid from 'uuid/v1';

import * as ArrayUtils from 'core/array';

import { WieldID } from 'modules/wield';
import { SexID, Sexes } from 'modules/sex';
import { SkillsetID, Skillsets } from 'modules/skillset';
import { IIndexable } from 'modules/indexable';
import { ArmorID, Armors } from 'modules/armor';
import { WeaponID, Weapons } from 'modules/weapon';
import { ArchetypeID, Archetypes } from 'modules/archetype';

// character name maximum length
const maxNameLength = 16;

export interface ICharacterData extends IIndexable {
	readonly name: string;
	readonly sex: SexID;
	readonly archetype: ArchetypeID;
	readonly skillset: SkillsetID;
	main: WeaponID;
	off: WeaponID;
	armor: ArmorID;
}

export type IOnMoveDown = (char: ICharacterData) => () => void;
export type IOnMoveUp = (char: ICharacterData) => () => void;
export type IOnDelete = (char: ICharacterData, name: string) => () => void;

// get default character properties
const init = (conf = {}): ICharacterData => {
	const now = Date.now();

	const defaultCharacterData: ICharacterData = {
		name: '',
		id: uuid(),
		creationDate: now,
		lastUpdate: now,
		sex: SexID.MALE,
		archetype: ArchetypeID.PP,
		skillset: SkillsetID.NONE,
		main: WeaponID.NONE,
		off: WeaponID.NONE,
		armor: ArmorID.NONE
	};
	return Object.assign({}, defaultCharacterData, conf);
};

// returns random character properties
const random = (name: string): ICharacterData => {
	const sex = ArrayUtils.getRandomItem(Sexes.keys());
	const archetype = ArrayUtils.getRandomItem(Archetypes.keys());
	let skillset = SkillsetID.NONE;

	if (-1 !== [ArchetypeID.PM].indexOf(archetype)) {
		skillset = ArrayUtils.getRandomItem(Skillsets.keys());
	}
	const character = init({
		name,
		skillset,
		sex,
		archetype
	});

	let main = Weapons.filter(character, WieldID.MAIN);

	if (main.length > 1) {
		main = main.filter(([id, data]) => id !== WeaponID.NONE);
	}
	character.main = ArrayUtils.getRandomItem(main)[0] || WeaponID.NONE;

	let off = Weapons.filter(character, WieldID.OFF);

	if (off.length > 1) {
		off = off.filter(([id, data]) => id !== WeaponID.NONE);
	}
	character.off = ArrayUtils.getRandomItem(off)[0] || WeaponID.NONE;

	let arm = Armors.filter(character);

	if (arm.length > 1) {
		arm = arm.filter(([id, data]) => id !== ArmorID.NONE);
	}
	character.armor = ArrayUtils.getRandomItem(arm)[0] || ArmorID.NONE;

	return character;
};

const isMagicUser = (char: ICharacterData) => {
	return (-1 !== [ArchetypeID.PM, ArchetypeID.SM, ArchetypeID.MM].indexOf(char.archetype));
};

const isBothWielding = (char: ICharacterData): boolean => {
	const main = Weapons.get(char.main);
	return main && -1 !== main.wield.indexOf(WieldID.BOTH);
};

const isDualWielding = (char: ICharacterData): boolean => {
	const main = Weapons.get(char.main);
	return main && -1 !== main.wield.indexOf(WieldID.DUAL);
};

const canWieldWeapon = (char: ICharacterData, weapon: WeaponID, wield: WieldID): boolean => {
	return Weapons.filter(char, wield).filter(([id]) => id === weapon).length > 0;
};

const canWieldArmor = (char: ICharacterData, armor: ArmorID): boolean => {
	return Armors.filter(char).filter(([id]) => id === armor).length > 0;
};

export const CharacterData = {
	maxNameLength,
	init,
	random,
	isMagicUser,
	isBothWielding,
	isDualWielding,
	canWieldWeapon,
	canWieldArmor
};
