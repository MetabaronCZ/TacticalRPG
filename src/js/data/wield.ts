import { WieldID, IWield } from 'models/wield';

interface IWieldTypes {
	[wieldType: string]: IWield;
}

const WieldTypes: IWieldTypes = {
	[WieldID.MAIN]: {
		title: 'Main hand'
	},
	[WieldID.OFF]: {
		title: 'Off hand'
	},
	[WieldID.BOTH]: {
		title: 'Both hands'
	},
	[WieldID.DUAL]: {
		title: 'Dual wield'
	}
};

export default WieldTypes;
