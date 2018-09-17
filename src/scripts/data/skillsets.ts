import { SkillsetList } from 'engine/character/skillset';
import { MagicSkillID } from 'engine/skill/magic/types';

import psychokinesis from 'engine/skill/magic/psychokinesis';
import whiteMagic from 'engine/skill/magic/white';
import blackMagic from 'engine/skill/magic/black';
import fireMagic from 'engine/skill/magic/fire';
import waterMagic from 'engine/skill/magic/water';
import windMagic from 'engine/skill/magic/wind';
import earthMagic from 'engine/skill/magic/earth';
import iceMagic from 'engine/skill/magic/ice';
import thunderMagic from 'engine/skill/magic/thunder';

const Skillsets = new SkillsetList({
	NONE: {
		title: 'none',
		description: '',
		element: 'NONE',
		skills: []
	},
	PSYCHOKINESIS: {
		title: 'Psychokinesis',
		description: '',
		element: 'PSYCHIC',
		skills: Object.keys(psychokinesis) as MagicSkillID[]
	},
	WHITE_MAGIC: {
		title: 'White Magic',
		description: '',
		element: 'HOLY',
		skills: Object.keys(whiteMagic) as MagicSkillID[]
	},
	BLACK_MAGIC: {
		title: 'Black Magic',
		description: '',
		element: 'DARK',
		skills: Object.keys(blackMagic) as MagicSkillID[]
	},
	FIRE_MAGIC: {
		title: 'Fire Magic',
		description: '',
		element: 'FIRE',
		skills: Object.keys(fireMagic) as MagicSkillID[]
	},
	WATER_MAGIC: {
		title: 'Water Magic',
		description: '',
		element: 'WATER',
		skills: Object.keys(waterMagic) as MagicSkillID[]
	},
	WIND_MAGIC: {
		title: 'Wind Magic',
		description: '',
		element: 'WIND',
		skills: Object.keys(windMagic) as MagicSkillID[]
	},
	EARTH_MAGIC: {
		title: 'Earth Magic',
		description: '',
		element: 'EARTH',
		skills: Object.keys(earthMagic) as MagicSkillID[]
	},
	ICE_MAGIC: {
		title: 'Ice Magic',
		description: '',
		element: 'ICE',
		skills: Object.keys(iceMagic) as MagicSkillID[]
	},
	THUNDER_MAGIC: {
		title: 'Thunder Magic',
		description: '',
		element: 'THUNDER',
		skills: Object.keys(thunderMagic) as MagicSkillID[]
	}
});

export default Skillsets;
