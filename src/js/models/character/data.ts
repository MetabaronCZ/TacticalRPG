import { IIndexable } from 'utils/array';

import { SexID } from 'models/sex';
import { JobID } from 'models/job';
import { ArmorID } from 'models/armor';
import { WeaponID } from 'models/weapon';
import { ArchCharID } from 'models/archetype';

export default interface ICharacterData extends IIndexable {
	name: string;
	sex: SexID;
	primary: ArchCharID;
	secondary: ArchCharID;
	job: JobID;
	main: WeaponID;
	off: WeaponID;
	armor: ArmorID;
}
