import uuid from 'uuid/v1';

import * as ArrayUtils from 'core/array';

import { WieldID } from 'modules/wield';
import { SexID, Sexes } from 'modules/sex';
import { Equipment } from 'modules/equipment';
import { IIndexable } from 'modules/indexable';
import { ArmorID, Armors } from 'modules/armor';
import { WeaponID, Weapons } from 'modules/weapon';
import { SkillsetID, Skillsets } from 'modules/skillset';
import { ArchetypeID, Archetypes } from 'modules/archetype';

export interface ICharacterData extends IIndexable {
	readonly name: string;
	readonly sex: SexID;
	readonly archetype: ArchetypeID;
	skillset: SkillsetID;
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
	const character = init({
		name,
		sex: ArrayUtils.getRandomItem(Sexes.keys()),
		archetype: ArrayUtils.getRandomItem(Archetypes.keys()),
		skillset: SkillsetID.NONE
	});

	if (isMagicUser(character)) {
		character.skillset = ArrayUtils.getRandomItem(Skillsets.keys());
	}
	let main = Weapons.filter(character, WieldID.MAIN);

	if (main.length > 1) {
		main = main.filter(([id, data]) => id !== WeaponID.NONE);
	}
	character.main = ArrayUtils.getRandomItem(main)[0] || WeaponID.NONE;

	if (
		!Equipment.isBothWielding(character.main) &&
		!Equipment.isDualWielding(character.main)
	) {
		let off = Weapons.filter(character, WieldID.OFF);

		if (off.length > 1) {
			off = off.filter(([id, data]) => id !== WeaponID.NONE);
		}
		character.off = ArrayUtils.getRandomItem(off)[0] || WeaponID.NONE;

	} else {
		character.off = WeaponID.NONE;
	}
	let arm = Armors.filter(character);

	if (arm.length > 1) {
		arm = arm.filter(([id, data]) => id !== ArmorID.NONE);
	}
	character.armor = ArrayUtils.getRandomItem(arm)[0] || ArmorID.NONE;

	return character;
};

const isMagicUser = (char: ICharacterData) => {
	return -1 !== char.archetype.indexOf('M');
};

export const CharacterData = {
	init,
	random,
	isMagicUser
};
