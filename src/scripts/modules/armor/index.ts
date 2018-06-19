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
}

export const Armors = new ArmorList({
	[ArmorID.NONE]: {
		title: 'none',
		description: 'No armor equipped'
	},
	[ArmorID.ROBE]: {
		title: 'Robe',
		description: ''
	},
	[ArmorID.LIGHT]: {
		title: 'Light Armor',
		description: ''
	},
	[ArmorID.HEAVY]: {
		title: 'Heavy Armor',
		description: ''
	}
});
