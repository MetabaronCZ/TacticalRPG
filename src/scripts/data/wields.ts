import DataList from 'core/data-list';
import { WieldID, IWieldData } from 'modules/equipment/wield-data';

const Wields = new DataList<WieldID, IWieldData>({
	MAIN: {
		title: 'Main hand'
	},
	OFF: {
		title: 'Off hand'
	},
	BOTH: {
		title: 'Both hands'
	},
	DUAL: {
		title: 'Dual wield'
	}
});

export default Wields;
