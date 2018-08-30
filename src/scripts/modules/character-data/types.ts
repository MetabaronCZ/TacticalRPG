import { SexID } from 'modules/sex/types';
import { ArmorID } from 'modules/armor/types';
import { WeaponID } from 'modules/weapon/types';
import { SkillsetID } from 'modules/skillset/types';
import { IIndexable } from 'modules/indexable/types';
import { ArchetypeID } from 'modules/archetype/types';

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