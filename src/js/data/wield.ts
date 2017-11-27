import { EWieldTypes } from 'models/wield-types';
import IWieldType from 'models/wield-type';

interface IWieldTypes {
	[wieldType: string]: IWieldType;
}

const WieldTypes: IWieldTypes = {
	[EWieldTypes.MAIN]: {
		title: 'Main hand'
	},
	[EWieldTypes.OFF]: {
		title: 'Off hand'
	},
	[EWieldTypes.BOTH]: {
		title: 'Both hands'
	},
	[EWieldTypes.DUAL]: {
		title: 'Dual wield'
	}
};

export default WieldTypes;
