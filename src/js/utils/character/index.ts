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
import { ArchetypeID, ArchetypeCharacteristicID as ArchCharID } from 'models/archetype';
import { JobID } from 'models/job';
import { ICharacter } from 'models/character';

import { WeaponID } from 'models/weapon';

// character name maximum length
export const maxNameLength: number = 16;

interface IDefaultCharacteData {
	name?: string;
	id?: string;
	creationDate?: number;
	lastUpdate?: number;
	sex?: SexID;
	primary?: ArchCharID;
	secondary?: ArchCharID;
	job?: JobID;
	main?: WeaponID;
	off?: WeaponID;
	armor?: ArmorID;
}

// get default character properties
export const makeCharacter = ({
	name = '',
	id = uuid(),
	creationDate,
	lastUpdate,
	sex = SexID.MALE,
	primary = ArchCharID.P,
	secondary = ArchCharID.P,
	job = JobID.NONE,
	main = WeaponID.NONE,
	off = WeaponID.NONE,
	armor = ArmorID.NONE,
}: IDefaultCharacteData): ICharacter => {
	const now: number = Date.now();

	return {
		name,
		id,
		creationDate: creationDate || now,
		lastUpdate: lastUpdate || now,
		sex,
		primary,
		secondary,
		job,
		main,
		off,
		armor
	};
};

// returns random character properties
export const getRandomCharacter = (name: string, job: JobID): ICharacter => {
	const sex: SexID = (getRandomArrayItem(Object.keys(SexID)) as SexID);
	const arch: ArchetypeID = getRandomArrayItem(Jobs[job].archetype) || ArchetypeID.PP;

	const character: ICharacter = makeCharacter({
		name,
		job,
		sex,
		primary: arch[0] as ArchCharID,
		secondary: arch[1] as ArchCharID
	});

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
