import DataList from 'core/data-list';

export enum ArchCharID {
	P = 'P',
	S = 'S',
	M = 'M'
}

export enum ArchetypeID {
	PP = 'PP',
	PS = 'PS',
	PM = 'PM',
	SP = 'SP',
	SS = 'SS',
	SM = 'SM',
	MP = 'MP',
	MS = 'MS',
	MM = 'MM'
}

export interface IArchetypeData {
	readonly title: string;
}

export const Archetypes = new DataList<ArchCharID, IArchetypeData>({
	[ArchCharID.P]: {
		title: 'Power'
	},
	[ArchCharID.S]: {
		title: 'Speed'
	},
	[ArchCharID.M]: {
		title: 'Magic'
	}
});
