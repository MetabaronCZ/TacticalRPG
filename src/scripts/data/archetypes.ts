import DataList from 'core/data-list';
import { ArchetypeID, IArchetypeData } from 'engine/character/archetype';

const Archetypes = new DataList<ArchetypeID, IArchetypeData>({
	PP: {
		id: 'PP',
		title: 'Warrior',
		description: 'Physically strong, durable warrior'
	},
	PS: {
		id: 'PS',
		title: 'Fighter',
		description: 'Balanced melee fighter'
	},
	PM: {
		id: 'PM',
		title: 'Magi-knight',
		description: 'Magic using fighter'
	},
	SS: {
		id: 'SS',
		title: 'Rogue',
		description: 'Agile melee fighter'
	},
	SM: {
		id: 'SM',
		title: 'Spellblade',
		description: 'Agile mage fighter'
	},
	MM: {
		id: 'MM',
		title: 'Mage',
		description: 'Strong magical user'
	}
});

export default Archetypes;
