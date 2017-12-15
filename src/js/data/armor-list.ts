import { ArchetypeID as ArchID } from 'models/archetype';
import { ArmorID, IArmor } from 'models/armor';

const ArmorList = new Map<ArmorID, IArmor>();

ArmorList.set(ArmorID.NONE, {
	title: 'none',
	description: 'No armor equipped',
	archetype: []
});

ArmorList.set(ArmorID.ROBE, {
	title: 'Robe',
	description: '???',
	archetype: [ArchID.PM, ArchID.SM, ArchID.MP, ArchID.MS, ArchID.MM]
});

ArmorList.set(ArmorID.LIGHT, {
	title: 'Light Armor',
	description: '???',
	archetype: [ArchID.PS, ArchID.SP, ArchID.SS, ArchID.SM, ArchID.MS]
});

ArmorList.set(ArmorID.HEAVY, {
	title: 'Heavy Armor',
	description: '???',
	archetype: [ArchID.PP, ArchID.PS, ArchID.PM, ArchID.SP, ArchID.MP]
});

export default ArmorList;
