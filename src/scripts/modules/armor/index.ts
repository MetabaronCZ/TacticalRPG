import { ArchetypeID } from 'modules/archetype';
import ArmorList from 'modules/armor/list';

const PP = ArchetypeID.PP;
const PS = ArchetypeID.PS;
const PM = ArchetypeID.PM;
const SS = ArchetypeID.SS;
const SM = ArchetypeID.SM;
const MM = ArchetypeID.MM;

export enum ArmorID {
	NONE = 'NONE',
	ROBE = 'ROBE',
	LIGHT = 'LIGHT',
	HEAVY = 'HEAVY'
}

export interface IArmorData {
	readonly title: string;
	readonly description: string;
	readonly archetype: ArchetypeID[];
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
		archetype: [PM, SM, MM]
	},
	[ArmorID.LIGHT]: {
		title: 'Light Armor',
		description: '',
		archetype: [PS, SS, SM]
	},
	[ArmorID.HEAVY]: {
		title: 'Heavy Armor',
		description: '',
		archetype: [PP, PS, PM]
	}
});
