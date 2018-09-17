import uuid from 'uuid/v1';

import * as ArrayUtils from 'core/array';

import Sexes from 'data/sexes';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Skillsets from 'data/skillsets';
import Archetypes from 'data/archetypes';

import { ICharacterData } from 'engine/character-data';
import { isDualWielding, isBothWielding } from 'engine/utils/equipment';

// get default character properties
export const createCharacterData = (conf: Partial<ICharacterData> = {}): ICharacterData => {
	const now = Date.now();

	const defaultCharacterData: ICharacterData = {
		name: '',
		id: uuid(),
		creationDate: now,
		lastUpdate: now,
		sex: 'MALE',
		archetype: 'PP',
		skillset: 'NONE',
		main: 'NONE',
		off: 'NONE',
		armor: 'NONE'
	};
	return Object.assign({}, defaultCharacterData, conf);
};

// returns random character properties
export const getRandomCharacterData = (name: string): ICharacterData => {
	const character = createCharacterData({
		name,
		sex: ArrayUtils.getRandomItem(Sexes.keys()),
		archetype: ArrayUtils.getRandomItem(Archetypes.keys()),
		skillset: 'NONE'
	});

	if (isMagicType(character)) {
		character.skillset = ArrayUtils.getRandomItem(Skillsets.keys());
	}
	let main = Weapons.filter(character, 'MAIN');

	if (main.length > 1) {
		main = main.filter(([id, data]) => id !== 'NONE');
	}
	character.main = ArrayUtils.getRandomItem(main)[0];

	if (
		!isBothWielding(character.main) &&
		!isDualWielding(character.main)
	) {
		let off = Weapons.filter(character, 'OFF');

		if (off.length > 1) {
			off = off.filter(([id, data]) => id !== 'NONE');
		}
		character.off = ArrayUtils.getRandomItem(off)[0];

	} else {
		character.off = 'NONE';
	}
	let arm = Armors.filter(character);

	if (arm.length > 1) {
		arm = arm.filter(([id, data]) => id !== 'NONE');
	}
	character.armor = ArrayUtils.getRandomItem(arm)[0];

	return character;
};

export const isPowerType = (char: ICharacterData): boolean => {
	return -1 !== char.archetype.indexOf('P');
};

export const isSpeedType = (char: ICharacterData): boolean => {
	return -1 !== char.archetype.indexOf('S');
};

export const isMagicType = (char: ICharacterData): boolean => {
	return -1 !== char.archetype.indexOf('M');
};
