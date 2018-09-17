import psychokinesis from 'data/skills/magic/psychokinesis';
import whiteMagic from 'data/skills/magic/white';
import blackMagic from 'data/skills/magic/black';
import fireMagic from 'data/skills/magic/fire';
import waterMagic from 'data/skills/magic/water';
import windMagic from 'data/skills/magic/wind';
import earthMagic from 'data/skills/magic/earth';
import iceMagic from 'data/skills/magic/ice';
import thunderMagic from 'data/skills/magic/thunder';

import { MagicSkillID } from 'engine/skill/magic';
import { SkillsetList } from 'engine/character/skillset-data';

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
