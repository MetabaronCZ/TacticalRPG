import DataList from 'models/data-list';

export enum WieldID {
	MAIN = 'MAIN',
	OFF = 'OFF',
	BOTH = 'BOTH',
	DUAL = 'DUAL'
}

export interface IWieldData {
	readonly title: string;
}

export const Wields = new DataList<WieldID, IWieldData>([
	[WieldID.MAIN, {
		title: 'Main hand'
	}],
	[WieldID.OFF, {
		title: 'Off hand'
	}],
	[WieldID.BOTH, {
		title: 'Both hands'
	}],
	[WieldID.DUAL, {
		title: 'Dual wield'
	}]
]);
