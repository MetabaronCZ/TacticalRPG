import { ESex } from 'models/sex';
import { EPrimaryArchetype } from 'models/primary-archetype';
import { ESecondaryArchetype } from 'models/secondary-archetype';
import { EJobs } from 'models/jobs';
import { EWeapons } from 'models/weapons';
import { EArmors } from 'models/armors';

export default interface ICharacter {
	name: string;
	sex: ESex;
	primary: EPrimaryArchetype;
	secondary: ESecondaryArchetype;
	job: EJobs;
	main: EWeapons;
	off: EWeapons;
	armor: EArmors;
}
