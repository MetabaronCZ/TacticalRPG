import { SexID } from 'engine/character/sex';
import { ArmorID } from 'engine/equipment/armor-data';
import { IIndexableData } from 'engine/indexable-data';
import { WeaponID } from 'engine/equipment/weapon-data';
import { ArchetypeID } from 'engine/character/archetype';
import { SkillsetID } from 'engine/character/skillset-data';

export interface ICharacterData extends IIndexableData {
	readonly name: string;
	readonly sex: SexID;
	readonly archetype: ArchetypeID;
	skillset: SkillsetID;
	main: WeaponID;
	off: WeaponID;
	armor: ArmorID;
}
