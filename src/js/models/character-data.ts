import uuid from 'uuid/v1';

import { IIndexable, getRandomArrayItem } from 'utils/array';

import { WieldID } from 'models/wield';
import { JobID, Jobs } from 'models/job';
import { SexID, Sexes } from 'models/sex';
import { ArmorID, Armors } from 'models/armor';
import { WeaponID, Weapons } from 'models/weapon';
import { ArchetypeID, ArchCharID } from 'models/archetype';

export interface ICharacterData extends IIndexable {
	name: string;
	sex: SexID;
	primary: ArchCharID;
	secondary: ArchCharID;
	job: JobID;
	main: WeaponID;
	off: WeaponID;
	armor: ArmorID;
}

export class CharacterData {
	// character name maximum length
	public static maxNameLength = 16;

	// get default character properties
	public static init({
		name = '',
		id = uuid(),
		creationDate = 0,
		lastUpdate = 0,
		sex = SexID.MALE,
		primary = ArchCharID.P,
		secondary = ArchCharID.P,
		job = JobID.NONE,
		main = WeaponID.NONE,
		off = WeaponID.NONE,
		armor = ArmorID.NONE,
	}): ICharacterData {
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
	}

	// returns random character properties
	public static random(name: string, jobId: JobID): ICharacterData {
		const sex = Sexes.getRandomKey();
		const job = Jobs.get(jobId);
		let arch = job ? getRandomArrayItem(job.archetype) : ArchetypeID.PP;
		arch = arch || ArchetypeID.PP;

		const character = this.init({
			name,
			job: jobId,
			sex,
			primary: arch[0] as ArchCharID,
			secondary: arch[1] as ArchCharID
		});

		const main = Weapons.filter(character, WieldID.MAIN);

		if (main.size > 1) {
			main.delete(WeaponID.NONE);
		}
		character.main = main.getRandomKey() || WeaponID.NONE;

		const off = Weapons.filter(character, WieldID.OFF);

		if (off.size > 1) {
			off.delete(WeaponID.NONE);
		}
		character.off = off.getRandomKey() || WeaponID.NONE;

		const arm = Armors.filter(character);

		if (arm.size > 1) {
			arm.delete(ArmorID.NONE);
		}
		character.armor = arm.getRandomKey();

		return character;
	}
}
