import DataList from 'core/data-list';
import { ArchetypeID, IArchetypeData } from 'engine/character/archetype';

const Archetypes = new DataList<ArchetypeID, IArchetypeData>({
	PP: {
		title: 'Warrior',
		description: 'Physically strong, durable warrior'
	},
	PS: {
		title: 'Fighter',
		description: 'Balanced melee fighter'
	},
	PM: {
		title: 'Magi-knight',
		description: 'Magic using fighter'
	},
	SS: {
		title: 'Rogue',
		description: 'Agile melee fighter'
	},
	SM: {
		title: 'Spellblade',
		description: 'Agile mage fighter'
	},
	MM: {
		title: 'Mage',
		description: 'Strong magical user'
	}
});

export default Archetypes;
