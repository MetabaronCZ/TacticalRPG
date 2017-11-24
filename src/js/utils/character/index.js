import { filter as filterJobs } from 'utils/character/jobs';
import { filter as filterWeapon } from 'utils/character/weapon';
import { filter as filterArmor } from 'utils/character/armor';
import { getRandomArrayItem } from 'utils/array';

import * as Wield from 'data/wield';
import sex from 'data/sex';
import Jobs from 'data/jobs';
import archetype from 'data/archetype';
import weapon from 'data/weapon';
import armor from 'data/armor';

// character name maximum length
export const maxNameLength = 16;

// get default character properties
export const getDefaultCharacter = () => {
	let character = {
		name: '',
		sex: Object.keys(sex)[0],
		main: Object.keys(weapon)[0],
		off: Object.keys(weapon)[0],
		armor: Object.keys(armor)[0]
	};

	character.primary = Object.keys(archetype)[0];
	character.secondary = Object.keys(archetype)[0];
	character.job = filterJobs(character)[0];

	return character;
};

// returns random character properties
export const getRandomCharacter = (name, cls) => {
	let character = getDefaultCharacter();
	let charSex = getRandomArrayItem(Object.keys(sex));
	let arch = getRandomArrayItem(Jobs[cls].archetype);

	character.name = name;
	character.job = cls;
	character.sex = charSex;
	character.primary = arch[0];
	character.secondary = arch[1];

	let main = filterWeapon(character, Wield.MAIN);

	if ( main.length > 1 ){
		main = main.filter(x => 'NONE' !== x);
		character.main = getRandomArrayItem(main);
	} else {
		character.main = main[0];
	}

	let off = filterWeapon(character, Wield.OFF);

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
