import DataList from 'core/data-list';
import { ArchetypeID, IArchetypeData } from 'modules/archetype/types';

const Archetypes = new DataList<ArchetypeID, IArchetypeData>({
	[ArchetypeID.PP]: {
		title: 'Warrior',
		description: 'Physically strong, durable warrior'
	},
	[ArchetypeID.PS]: {
		title: 'Fighter',
		description: 'Balanced melee fighter'
	},
	[ArchetypeID.PM]: {
		title: 'Magi-knight',
		description: 'Magic using fighter'
	},
	[ArchetypeID.SS]: {
		title: 'Rogue',
		description: 'Agile melee fighter'
	},
	[ArchetypeID.SM]: {
		title: 'Spellblade',
		description: 'Agile mage fighter'
	},
	[ArchetypeID.MM]: {
		title: 'Mage',
		description: 'Strong magical user'
	}
});

export default Archetypes;
