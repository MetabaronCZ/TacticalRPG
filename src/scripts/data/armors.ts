import DataList from 'core/data-list';
import { ArmorID, IArmorData } from 'modules/equipment/armor-data';

const Armors = new DataList<ArmorID, IArmorData>({
	NONE: {
		id: 'NONE',
		title: 'none',
		description: 'No armor equipped',
		skills: []
	},
	MAGICAL: {
		id: 'MAGICAL',
		title: 'Magical armor',
		description: '',
		mpBonus: 100,
		skills: ['AETHERSHIELD']
	},
	LIGHT: {
		id: 'LIGHT',
		title: 'Light Armor',
		description: '',
		skills: ['EVADE']
	},
	HEAVY: {
		id: 'HEAVY',
		title: 'Heavy Armor',
		description: '',
		hpBonus: 100,
		skills: []
	}
});

export default Armors;
