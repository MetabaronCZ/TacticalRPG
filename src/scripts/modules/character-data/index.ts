import uuid from 'uuid/v1';

import * as ArrayUtils from 'core/array';

import Sexes from 'modules/sex';
import Armors from 'modules/armor';
import Weapons from 'modules/weapon';
import Skillsets from 'modules/skillset';
import Equipment from 'modules/equipment';
import Archetypes from 'modules/archetype';

import { SexID } from 'modules/sex/types';
import { WieldID } from 'modules/wield/types';
import { ArmorID } from 'modules/armor/types';
import { WeaponID } from 'modules/weapon/types';
import { SkillsetID } from 'modules/skillset/types';
import { ArchetypeID } from 'modules/archetype/types';
import { ICharacterData } from 'modules/character-data/types';

type ICharacterConfig = {
	[attr in keyof ICharacterData]?: ICharacterData[attr];
};

// get default character properties
const init = (conf: ICharacterConfig = {}): ICharacterData => {
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

	if (isMagicType(character)) {
		character.skillset = ArrayUtils.getRandomItem(Skillsets.keys());
	}
	let main = Weapons.filter(character, WieldID.MAIN);

	if (main.length > 1) {
		main = main.filter(([id, data]) => id !== WeaponID.NONE);
	}
	character.main = ArrayUtils.getRandomItem(main)[0];

	if (
		!Equipment.isBothWielding(character.main) &&
		!Equipment.isDualWielding(character.main)
	) {
		let off = Weapons.filter(character, WieldID.OFF);

		if (off.length > 1) {
			off = off.filter(([id, data]) => id !== WeaponID.NONE);
		}
		character.off = ArrayUtils.getRandomItem(off)[0];

	} else {
		character.off = WeaponID.NONE;
	}
	let arm = Armors.filter(character);

	if (arm.length > 1) {
		arm = arm.filter(([id, data]) => id !== ArmorID.NONE);
	}
	character.armor = ArrayUtils.getRandomItem(arm)[0];

	return character;
};

const isPowerType = (char: ICharacterData) => -1 !== char.archetype.indexOf('P');
const isSpeedType = (char: ICharacterData) => -1 !== char.archetype.indexOf('S');
const isMagicType = (char: ICharacterData) => -1 !== char.archetype.indexOf('M');

const CharacterData = {
	init,
	random,
	isPowerType,
	isSpeedType,
	isMagicType
};

export default CharacterData;
