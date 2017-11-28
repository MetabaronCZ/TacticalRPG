import { SexID } from 'models/sex';
import { PrimaryID } from 'models/primary';
import { SecondaryID } from 'models/secondary';
import { JobID } from 'models/job';
import { WeaponID } from 'models/weapon';
import { ArmorID } from 'models/armor';

export interface ICharacter {
	id: string;
	name: string;
	sex: SexID;
	primary: PrimaryID;
	secondary: SecondaryID;
	job: JobID;
	main: WeaponID;
	off: WeaponID;
	armor: ArmorID;
}
