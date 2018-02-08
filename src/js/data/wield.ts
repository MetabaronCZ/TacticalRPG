import { WieldID, IWieldData } from 'models/wield';

const WieldData: Array <[WieldID, IWieldData]> = [
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
];

export default WieldData;
