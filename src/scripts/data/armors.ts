import DataList from 'core/data-list';
import { ArmorID, IArmorData } from 'modules/equipment/armor-data';

const Armors = new DataList<ArmorID, IArmorData>({
	NONE: {
		id: 'NONE',
		title: 'none',
		description: 'No armor equipped',
		physical: 1,
		magical: 1
	},
	MAGICAL: {
		id: 'MAGICAL',
		title: 'Magical armor',
		description: '',
		physical: 1,
		magical: 0.5
	},
	LIGHT: {
		id: 'LIGHT',
		title: 'Light Armor',
		description: '',
		physical: 1,
		magical: 1
	},
	HEAVY: {
		id: 'HEAVY',
		title: 'Heavy Armor',
		description: '',
		physical: 0.5,
		magical: 1
	}
});

export default Armors;
