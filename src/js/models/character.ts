import { SexID } from 'models/sex';
import { JobID } from 'models/job';
import { WeaponID } from 'models/weapon';
import { ArmorID } from 'models/armor';
import { IIndexable } from 'utils/array';
import { ArchetypeCharacteristicID as ArchCharID } from 'models/archetype';

export interface ICharacter extends IIndexable {
	name: string;
	sex: SexID;
	primary: ArchCharID;
	secondary: ArchCharID;
	job: JobID;
	main: WeaponID;
	off: WeaponID;
	armor: ArmorID;
}
