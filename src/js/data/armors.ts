import { EArchetypes as Arch } from 'models/archetypes';
import { EArmors } from 'models/armors';
import IArmor from 'models/armor';

interface IArmors {
	[armor: string]: IArmor;
}

const Armors: IArmors = {
	[EArmors.NONE]: {
		title: 'none',
		description: 'No armor equipped'
	},
	[EArmors.ROBE]: {
		title: 'Robe',
		description: '???',
		archetype: [Arch.PM, Arch.SM, Arch.MP, Arch.MS, Arch.MM]
	},
	[EArmors.LIGHT]: {
		title: 'Light Armor',
		description: '???',
		archetype: [Arch.PS, Arch.SP, Arch.SS, Arch.SM, Arch.MS]
	},
	[EArmors.HEAVY]: {
		title: 'Heavy Armor',
		description: '???',
		archetype: [Arch.PP, Arch.PS, Arch.PM, Arch.SP, Arch.MP]
	}
};

export default Armors;
