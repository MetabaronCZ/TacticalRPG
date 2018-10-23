export type ArchetypeID = 'PP' | 'PS' | 'PM' | 'SS' | 'SM' | 'MM';

export interface IArchetypeData {
	readonly id: ArchetypeID;
	readonly title: string;
	readonly description: string;
	readonly type: {
		readonly P: boolean;
		readonly S: boolean;
		readonly M: boolean;
	};
}
