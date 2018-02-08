import { ArchetypeID as ArchID } from 'models/archetype';
import { ArmorID, IArmorData } from 'models/armor';

const armorData: Array<[ArmorID, IArmorData]> = [
	[ArmorID.NONE, {
		title: 'none',
		description: 'No armor equipped',
		archetype: []
	}],
	[ArmorID.ROBE, {
		title: 'Robe',
		description: '???',
		archetype: [ArchID.PM, ArchID.SM, ArchID.MP, ArchID.MS, ArchID.MM]
	}],
	[ArmorID.LIGHT, {
		title: 'Light Armor',
		description: '???',
		archetype: [ArchID.PS, ArchID.SP, ArchID.SS, ArchID.SM, ArchID.MS]
	}],
	[ArmorID.HEAVY, {
		title: 'Heavy Armor',
		description: '???',
		archetype: [ArchID.PP, ArchID.PS, ArchID.PM, ArchID.SP, ArchID.MP]
	}]
];

export default armorData;
