import DataList from 'core/data-list';
import { WieldID, IWieldData } from 'modules/wield/types';

const Wields = new DataList<WieldID, IWieldData>({
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
});

export default Wields;
