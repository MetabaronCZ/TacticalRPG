import { WieldID, IWield } from 'models/wield';

const WieldList: Map<WieldID, IWield> = new Map();

WieldList.set(WieldID.MAIN, {
	title: 'Main hand'
});

WieldList.set(WieldID.OFF, {
	title: 'Off hand'
});

WieldList.set(WieldID.BOTH, {
	title: 'Both hands'
});

WieldList.set(WieldID.DUAL, {
	title: 'Dual wield'
});

export default WieldList;
