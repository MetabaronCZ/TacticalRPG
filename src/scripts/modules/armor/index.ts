import { ArchetypeID as ArchID } from 'modules/archetype';
import ArmorList from 'modules/armor/list';

export enum ArmorID {
	NONE = 'NONE',
	ROBE = 'ROBE',
	LIGHT = 'LIGHT',
	HEAVY = 'HEAVY'
}

export interface IArmorData {
	readonly title: string;
	readonly description: string;
	readonly archetype: ArchID[];
}

export const Armors = new ArmorList({
	[ArmorID.NONE]: {
		title: 'none',
		description: 'No armor equipped',
		archetype: []
	},
	[ArmorID.ROBE]: {
		title: 'Robe',
		description: '',
		archetype: [ArchID.PM, ArchID.SM, ArchID.MP, ArchID.MS, ArchID.MM]
	},
	[ArmorID.LIGHT]: {
		title: 'Light Armor',
		description: '',
		archetype: [ArchID.PS, ArchID.SP, ArchID.SS, ArchID.SM, ArchID.MS]
	},
	[ArmorID.HEAVY]: {
		title: 'Heavy Armor',
		description: '',
		archetype: [ArchID.PP, ArchID.PS, ArchID.PM, ArchID.SP, ArchID.MP]
	}
});
