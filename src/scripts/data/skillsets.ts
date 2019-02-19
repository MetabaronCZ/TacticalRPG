import DataList from 'core/data-list';

import psychokinesis from 'data/skills/magic/psychokinesis';
import holyMagic from 'data/skills/magic/holy';
import darkMagic from 'data/skills/magic/dark';
import fireMagic from 'data/skills/magic/fire';
import waterMagic from 'data/skills/magic/water';
import windMagic from 'data/skills/magic/wind';
import earthMagic from 'data/skills/magic/earth';
import iceMagic from 'data/skills/magic/ice';
import thunderMagic from 'data/skills/magic/thunder';

import { MagicSkillID } from 'modules/skill/magic';
import { SkillsetID, ISkillsetData } from 'modules/character/skillset-data';

const Skillsets = new DataList<SkillsetID, ISkillsetData>({
	NONE: {
		id: 'NONE',
		title: 'none',
		description: '',
		element: 'NONE',
		skills: []
	},
	PSYCHOKINESIS: {
		id: 'PSYCHOKINESIS',
		title: 'Psychokinesis',
		description: '',
		element: 'PSYCHIC',
		skills: Object.keys(psychokinesis) as MagicSkillID[]
	},
	HOLY_MAGIC: {
		id: 'HOLY_MAGIC',
		title: 'Holy Magic',
		description: '',
		element: 'HOLY',
		skills: Object.keys(holyMagic) as MagicSkillID[]
	},
	DARK_MAGIC: {
		id: 'DARK_MAGIC',
		title: 'Dark Magic',
		description: '',
		element: 'DARK',
		skills: Object.keys(darkMagic) as MagicSkillID[]
	},
	FIRE_MAGIC: {
		id: 'FIRE_MAGIC',
		title: 'Fire Magic',
		description: '',
		element: 'FIRE',
		skills: Object.keys(fireMagic) as MagicSkillID[]
	},
	WATER_MAGIC: {
		id: 'WATER_MAGIC',
		title: 'Water Magic',
		description: '',
		element: 'WATER',
		skills: Object.keys(waterMagic) as MagicSkillID[]
	},
	WIND_MAGIC: {
		id: 'WIND_MAGIC',
		title: 'Wind Magic',
		description: '',
		element: 'WIND',
		skills: Object.keys(windMagic) as MagicSkillID[]
	},
	EARTH_MAGIC: {
		id: 'EARTH_MAGIC',
		title: 'Earth Magic',
		description: '',
		element: 'EARTH',
		skills: Object.keys(earthMagic) as MagicSkillID[]
	},
	ICE_MAGIC: {
		id: 'ICE_MAGIC',
		title: 'Ice Magic',
		description: '',
		element: 'ICE',
		skills: Object.keys(iceMagic) as MagicSkillID[]
	},
	THUNDER_MAGIC: {
		id: 'THUNDER_MAGIC',
		title: 'Thunder Magic',
		description: '',
		element: 'THUNDER',
		skills: Object.keys(thunderMagic) as MagicSkillID[]
	}
});

export default Skillsets;
