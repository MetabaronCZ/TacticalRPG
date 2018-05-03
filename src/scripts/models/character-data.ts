import uuid from 'uuid/v1';

import * as ArrayUtils from 'core/array';

import { WieldID } from 'models/wield';
import { JobID, Jobs } from 'models/job';
import { SexID, Sexes } from 'models/sex';
import { SkillsetID } from 'models/skillset';
import { IIndexable } from 'models/indexable';
import { ArmorID, Armors } from 'models/armor';
import { WeaponID, Weapons } from 'models/weapon';
import { ArchetypeID, ArchCharID } from 'models/archetype';

// character name maximum length
const maxNameLength = 16;

export interface ICharacterData extends IIndexable {
	readonly name: string;
	readonly sex: SexID;
	readonly primary: ArchCharID;
	readonly secondary: ArchCharID;
	skillset: SkillsetID;
	job: JobID;
	main: WeaponID;
	off: WeaponID;
	armor: ArmorID;
}

// get default character properties
const init = (conf = {}): ICharacterData => {
	const now = Date.now();

	const defaultCharacterData: ICharacterData = {
		name: '',
		id: uuid(),
		creationDate: now,
		lastUpdate: now,
		sex: SexID.MALE,
		primary: ArchCharID.P,
		secondary: ArchCharID.P,
		job: JobID.NONE,
		skillset: SkillsetID.NONE,
		main: WeaponID.NONE,
		off: WeaponID.NONE,
		armor: ArmorID.NONE
	};

	const job = Jobs.filter(defaultCharacterData).entries()[0];

	defaultCharacterData.job = job[0];
	defaultCharacterData.skillset = job[1].skillsets[0];

	return Object.assign({}, defaultCharacterData, conf);
};

// returns random character properties
const random = (name: string, jobId: JobID): ICharacterData => {
	const sex = Sexes.getRandomKey();
	const job = Jobs.get(jobId);
	const skillset = ArrayUtils.getRandomItem(job.skillsets);
	let arch = job ? ArrayUtils.getRandomItem(job.archetype) : ArchetypeID.PP;
	arch = arch || ArchetypeID.PP;

	const character = init({
		name,
		job: jobId,
		skillset,
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
};

const isBothWielding = (char: ICharacterData): boolean => {
	const main = Weapons.get(char.main);
	return main && (JobID.BAR !== char.job) && -1 !== main.wield.indexOf(WieldID.BOTH);
};

const isDualWielding = (char: ICharacterData): boolean => {
	const main = Weapons.get(char.main);
	return main && -1 !== main.wield.indexOf(WieldID.DUAL);
};

export const CharacterData = {
	maxNameLength,
	init,
	random,
	isBothWielding,
	isDualWielding
};
