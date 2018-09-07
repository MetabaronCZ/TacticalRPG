import { IEarthMagicSkillList, MagicSkillID } from 'engine/skill/magic/types';
import { ISkillset } from 'engine/skillset';
import { SkillRange } from 'engine/skill';

const earthMagic: IEarthMagicSkillList = {
	EARTH_MAGIC_BOULDER: {
		title: 'Boulder',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'EARTH',
		physicalDamage: 0.5,
		elementalDamage: 1
	},
	EARTH_MAGIC_EARTH_SPIKE: {
		title: 'Earth Spike',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'EARTH',
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: ['STUN']
	},
	EARTH_MAGIC_EARTHQUAKE: {
		title: 'Earthquake',
		cost: 4,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'EARTH',
		physicalDamage: 0.25,
		elementalDamage: 5,
		status: []
	},
	EARTH_MAGIC_STONE_SKIN: {
		title: 'Stone Skin',
		cost: 0,
		type: 'PASSIVE',
		range: SkillRange.R0,
		area: 'SINGLE',
		target: 'SELF',
		element: 'EARTH',
		status: ['IRON_SKIN']
	}
};

export const earthMagicSkillset: ISkillset = {
	title: 'Earth Magic',
	description: '',
	element: 'EARTH',
	skills: Object.keys(earthMagic) as MagicSkillID[]
};

export default earthMagic;
