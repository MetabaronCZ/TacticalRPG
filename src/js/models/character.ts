import { SexID } from 'models/sex';
import { EPrimary } from 'models/primary';
import { ESecondary } from 'models/secondary';
import { EJobs } from 'models/jobs';
import { EWeapons } from 'models/weapons';
import { ArmorID } from 'models/armor';

export default interface ICharacter {
	name: string;
	sex: SexID;
	primary: EPrimary;
	secondary: ESecondary;
	job: EJobs;
	main: EWeapons;
	off: EWeapons;
	armor: ArmorID;
}
