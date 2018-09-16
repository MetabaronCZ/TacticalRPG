import { SkillsetID } from 'modules/skillset/types';

import { ArmorID } from 'engine/armor-data';
import { SexID } from 'engine/character/sex';
import { WeaponID } from 'engine/weapon-data';
import { IIndexable } from 'engine/indexable';
import { ArchetypeID } from 'engine/character/archetype';

export interface ICharacterData extends IIndexable {
	readonly name: string;
	readonly sex: SexID;
	readonly archetype: ArchetypeID;
	skillset: SkillsetID;
	main: WeaponID;
	off: WeaponID;
	armor: ArmorID;
}

export type IOnMoveDown = (char: ICharacterData) => () => void;
export type IOnMoveUp = (char: ICharacterData) => () => void;
export type IOnDelete = (char: ICharacterData, name: string) => () => void;
