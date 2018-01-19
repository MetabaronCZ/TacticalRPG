import uuid from 'uuid';

import { filter as filterJobs } from 'utils/character/jobs';
import { filter as filterWeapon } from 'utils/character/weapon';
import { filter as filterArmor } from 'utils/character/armor';
import { getRandomArrayItem } from 'utils/array';
import { getRandomMapItem } from 'utils/map';

import JobList from 'data/job-list';
import ArchetypeList from 'data/archetype-list';
import WeaponList from 'data/weapon-list';
import { WieldID } from 'models/wield';
import { SexID } from 'models/sex';
import { ArmorID, IArmor } from 'models/armor';
import { ArchetypeID, ArchetypeCharacteristicID as ArchCharID } from 'models/archetype';
import { JobID, IJob } from 'models/job';
import { ICharacter } from 'models/character';

import { WeaponID, IWeapon } from 'models/weapon';

// character name maximum length
export const maxNameLength = 16;

interface IDefaultCharacterData {
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
}: IDefaultCharacterData): ICharacter => {
	const now = Date.now();

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
export const getRandomCharacter = (name: string, jobId: JobID): ICharacter => {
	const sex = (getRandomArrayItem(Object.keys(SexID)) as SexID);
	const job = JobList.get(jobId);
	let arch = job ? getRandomArrayItem(job.archetype) : ArchetypeID.PP;
	arch = arch || ArchetypeID.PP;

	const character = makeCharacter({
		name,
		job: jobId,
		sex,
		primary: arch[0] as ArchCharID,
		secondary: arch[1] as ArchCharID
	});

	const main = filterWeapon(character, WieldID.MAIN);

	if (main.size > 1) {
		const filtered = new Map<WeaponID, IWeapon>(main);
		filtered.delete(WeaponID.NONE);
		character.main = getRandomMapItem(filtered);
	} else {
		character.main = Array.from(main.keys())[0];
	}

	const off = filterWeapon(character, WieldID.OFF);

	if (off.size > 1) {
		const filtered = new Map<WeaponID, IWeapon>(main);
		filtered.delete(WeaponID.NONE);
		character.off = getRandomMapItem(filtered);
	} else {
		character.off = Array.from(main.keys())[0];
	}

	const arm = filterArmor(character);

	if (arm.size > 1) {
		const filtered = new Map<ArmorID, IArmor>(arm);
		filtered.delete(ArmorID.NONE);
		character.armor = getRandomMapItem(filtered);
	} else {
		character.armor = Array.from(arm.keys())[0];
	}

	return character;
};
