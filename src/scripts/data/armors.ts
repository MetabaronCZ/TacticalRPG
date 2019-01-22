import DataList from 'core/data-list';
import { ArmorID, IArmorData } from 'modules/equipment/armor-data';

const Armors = new DataList<ArmorID, IArmorData>({
	NONE: {
		id: 'NONE',
		title: 'none',
		description: 'No armor equipped',
		physical: 0,
		magical: 0
	},
	MAGICAL: {
		id: 'MAGICAL',
		title: 'Magical',
		description: '',
		physical: 0,
		magical: 100
	},
	LIGHT: {
		id: 'LIGHT',
		title: 'Light Armor',
		description: '',
		physical: 0,
		magical: 0
	},
	HEAVY: {
		id: 'HEAVY',
		title: 'Heavy Armor',
		description: '',
		physical: 100,
		magical: 0
	}
});

export default Armors;
