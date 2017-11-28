import uuid from 'uuid';

import { filter as filterJobs } from 'utils/character/jobs';
import { filter as filterWeapon } from 'utils/character/weapon';
import { filter as filterArmor } from 'utils/character/armor';
import { getRandomArrayItem } from 'utils/array';

import Jobs from 'data/jobs';
import Archetypes from 'data/archetypes';
import Weapons from 'data/weapon';
import { WieldID } from 'models/wield';
import { SexID } from 'models/sex';
import { ArmorID } from 'models/armor';
import { ArchetypeID } from 'models/archetype';
import { JobID } from 'models/job';
import { ICharacter } from 'models/character';
import { PrimaryID } from 'models/primary';
import { SecondaryID } from 'models/secondary';
import { WeaponID } from 'models/weapon';

// character name maximum length
export const maxNameLength: number = 16;

// get default character properties
export const getDefaultCharacter = (): ICharacter => ({
	id: '',
	name: '',
	sex: SexID.MALE,
	primary: PrimaryID.P,
	secondary: SecondaryID.P,
	job: JobID.NONE,
	main: WeaponID.NONE,
	off: WeaponID.NONE,
	armor: ArmorID.NONE
});

// returns random character properties
export const getRandomCharacter = (name: string, job: JobID): ICharacter => {
	const character: ICharacter = getDefaultCharacter();
	const charsex: SexID = (getRandomArrayItem(Object.keys(SexID)) as SexID);
	const arch: ArchetypeID = getRandomArrayItem(Jobs[job].archetype) || ArchetypeID.PP;

	character.id = uuid();
	character.name = name;
	character.job = job;
	character.sex = charsex;
	character.primary = arch[0] as PrimaryID;
	character.secondary = arch[1] as SecondaryID;

	let main: WeaponID[] = filterWeapon(character, WieldID.MAIN);

	if (main.length > 1) {
		main = main.filter((x) => WeaponID.NONE !== x);
		character.main = getRandomArrayItem(main);
	} else {
		character.main = main[0];
	}

	let off: WeaponID[] = filterWeapon(character, WieldID.OFF);

	if (off.length > 1) {
		off = off.filter((x) => WeaponID.NONE !== x);
		character.off = getRandomArrayItem(off);
	} else {
		character.off = off[0];
	}

	let arm: ArmorID[] = filterArmor(character);

	if (arm.length > 1) {
		arm = arm.filter((x) => ArmorID.NONE !== x);
		character.armor = getRandomArrayItem(arm);
	} else {
		character.armor = arm[0];
	}

	return character;
};
