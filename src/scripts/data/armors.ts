import DataList from 'core/data-list';
import { ArmorID, IArmorData } from 'engine/equipment/armor-data';

const Armors = new DataList<ArmorID, IArmorData>({
	NONE: {
		title: 'none',
		description: 'No armor equipped',
		physicalDefense: 1,
		magicalDefense: 1
	},
	ROBE: {
		title: 'Robe',
		description: '',
		physicalDefense: 25,
		magicalDefense: 75
	},
	LIGHT: {
		title: 'Light Armor',
		description: '',
		physicalDefense: 50,
		magicalDefense: 1
	},
	HEAVY: {
		title: 'Heavy Armor',
		description: '',
		physicalDefense: 75,
		magicalDefense: 25
	}
});

export default Armors;
