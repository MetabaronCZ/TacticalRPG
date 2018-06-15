import uuid from 'uuid/v1';

import * as ArrayUtils from 'core/array';

import { WieldID } from 'modules/wield';
import { JobID, Jobs } from 'modules/job';
import { SexID, Sexes } from 'modules/sex';
import { SkillsetID } from 'modules/skillset';
import { IIndexable } from 'modules/indexable';
import { ArmorID, Armors } from 'modules/armor';
import { WeaponID, Weapons } from 'modules/weapon';
import { ArchetypeID, ArchCharID } from 'modules/archetype';

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

export type IOnMoveDown = (char: ICharacterData) => () => void;
export type IOnMoveUp = (char: ICharacterData) => () => void;
export type IOnDelete = (char: ICharacterData, name: string) => () => void;

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

	const job = Jobs.filter(defaultCharacterData)[0];

	defaultCharacterData.job = job[0];
	defaultCharacterData.skillset = job[1].skillsets[0];

	return Object.assign({}, defaultCharacterData, conf);
};

// returns random character properties
const random = (name: string, jobId: JobID): ICharacterData => {
	const sex = ArrayUtils.getRandomItem(Sexes.keys());
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

	let main = Weapons.filter(character, WieldID.MAIN);

	if (main.length > 1) {
		main = main.filter(([id, data]) => id !== WeaponID.NONE);
	}
	character.main = ArrayUtils.getRandomItem(main)[0] || WeaponID.NONE;

	let off = Weapons.filter(character, WieldID.OFF);

	if (off.length > 1) {
		off = off.filter(([id, data]) => id !== WeaponID.NONE);
	}
	character.off = ArrayUtils.getRandomItem(off)[0] || WeaponID.NONE;

	let arm = Armors.filter(character);

	if (arm.length > 1) {
		arm = arm.filter(([id, data]) => id !== ArmorID.NONE);
	}
	character.armor = ArrayUtils.getRandomItem(arm)[0] || ArmorID.NONE;

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

const canWieldWeapon = (char: ICharacterData, weapon: WeaponID, wield: WieldID): boolean => {
	return Weapons.filter(char, wield).filter(([id]) => id === weapon).length > 0;
};

const canWieldArmor = (char: ICharacterData, armor: ArmorID): boolean => {
	return Armors.filter(char).filter(([id]) => id === armor).length > 0;
};

export const CharacterData = {
	maxNameLength,
	init,
	random,
	isBothWielding,
	isDualWielding,
	canWieldWeapon,
	canWieldArmor
};
