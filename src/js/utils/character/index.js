import { filter as filterJobs } from 'utils/character/jobs';
import { filter as filterWeapon } from 'utils/character/weapon';
import { filter as filterArmor } from 'utils/character/armor';
import { getRandomArrayItem } from 'utils/array';

import { WieldID } from 'models/wield';
import { SexID } from 'models/sex';
import Jobs from 'data/jobs';
import Archetypes from 'data/archetypes';
import Weapons from 'data/weapons';
import { ArmorID } from 'models/armor';

// character name maximum length
export const maxNameLength = 16;

// get default character properties
export const getDefaultCharacter = () => {
	let character = {
		name: '',
		sex: SexID.MALE,
		main: Object.keys(Weapons)[0],
		off: Object.keys(Weapons)[0],
		armor: ArmorID.NONE
	};

	character.primary = Object.keys(Archetypes)[0];
	character.secondary = Object.keys(Archetypes)[0];
	character.job = filterJobs(character)[0];

	return character;
};

// returns random character properties
export const getRandomCharacter = (name, cls) => {
	let character = getDefaultCharacter();
	let charsex = getRandomArrayItem(Object.keys(SexID));
	let arch = getRandomArrayItem(Jobs[cls].archetype);

	character.name = name;
	character.job = cls;
	character.sex = charsex;
	character.primary = arch[0];
	character.secondary = arch[1];

	let main = filterWeapon(character, WieldID.MAIN);

	if ( main.length > 1 ){
		main = main.filter(x => 'NONE' !== x);
		character.main = getRandomArrayItem(main);
	} else {
		character.main = main[0];
	}

	let off = filterWeapon(character, WieldID.OFF);

	if ( off.length > 1 ){
		off = off.filter(x => 'NONE' !== x);
		character.off = off;
		character.off = getRandomArrayItem(off);
	} else {
		character.off = off[0];
	}

	let arm = filterArmor(character);

	if ( arm.length > 1 ){
		arm = arm.filter(x => 'NONE' !== x);
		character.armor = getRandomArrayItem(arm);
	} else {
		character.armor = arm[0];
	}

	return character;
};
