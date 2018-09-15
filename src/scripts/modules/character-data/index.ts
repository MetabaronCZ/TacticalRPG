import uuid from 'uuid/v1';

import * as ArrayUtils from 'core/array';

import Sexes from 'data/sexes';
import Armors from 'data/armors';
import Archetypes from 'data/archetypes';

import Weapons from 'modules/weapon';
import Skillsets from 'modules/skillset';
import Equipment from 'modules/equipment';
import { WeaponID } from 'modules/weapon/types';
import { SkillsetID } from 'modules/skillset/types';
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
		sex: 'MALE',
		archetype: 'PP',
		skillset: SkillsetID.NONE,
		main: WeaponID.NONE,
		off: WeaponID.NONE,
		armor: 'NONE'
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
	let main = Weapons.filter(character, 'MAIN');

	if (main.length > 1) {
		main = main.filter(([id, data]) => id !== WeaponID.NONE);
	}
	character.main = ArrayUtils.getRandomItem(main)[0];

	if (
		!Equipment.isBothWielding(character.main) &&
		!Equipment.isDualWielding(character.main)
	) {
		let off = Weapons.filter(character, 'OFF');

		if (off.length > 1) {
			off = off.filter(([id, data]) => id !== WeaponID.NONE);
		}
		character.off = ArrayUtils.getRandomItem(off)[0];

	} else {
		character.off = WeaponID.NONE;
	}
	let arm = Armors.filter(character);

	if (arm.length > 1) {
		arm = arm.filter(([id, data]) => id !== 'NONE');
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
