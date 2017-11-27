import { EArchetypes as Arch } from 'models/archetypes';
import { ArmorID, IArmor } from 'models/armor';

const Armors = new Map<ArmorID, IArmor>([
	[ArmorID.NONE, {
		title: 'none',
		description: 'No armor equipped',
		archetype: []
	}],
	[ArmorID.ROBE, {
		title: 'Robe',
		description: '???',
		archetype: [Arch.PM, Arch.SM, Arch.MP, Arch.MS, Arch.MM]
	}],
	[ArmorID.LIGHT, {
		title: 'Light Armor',
		description: '???',
		archetype: [Arch.PS, Arch.SP, Arch.SS, Arch.SM, Arch.MS]
	}],
	[ArmorID.HEAVY, {
		title: 'Heavy Armor',
		description: '???',
		archetype: [Arch.PP, Arch.PS, Arch.PM, Arch.SP, Arch.MP]
	}]
]);

export default Armors;
