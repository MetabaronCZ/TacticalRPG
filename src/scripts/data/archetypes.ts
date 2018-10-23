import DataList from 'core/data-list';
import { ArchetypeID, IArchetypeData } from 'modules/character/archetype';

const Archetypes = new DataList<ArchetypeID, IArchetypeData>({
	PP: {
		id: 'PP',
		title: 'Warrior',
		description: 'Physically strong, durable warrior',
		type: { P: true, S: false, M: false }
	},
	PS: {
		id: 'PS',
		title: 'Fighter',
		description: 'Balanced melee fighter',
		type: { P: true, S: true, M: false }
	},
	PM: {
		id: 'PM',
		title: 'Magi-knight',
		description: 'Magic using fighter',
		type: { P: true, S: false, M: true }
	},
	SS: {
		id: 'SS',
		title: 'Rogue',
		description: 'Agile melee fighter',
		type: { P: false, S: true, M: false }
	},
	SM: {
		id: 'SM',
		title: 'Spellblade',
		description: 'Agile mage fighter',
		type: { P: false, S: true, M: true }
	},
	MM: {
		id: 'MM',
		title: 'Mage',
		description: 'Strong magical user',
		type: { P: false, S: false, M: true }
	}
});

export default Archetypes;
