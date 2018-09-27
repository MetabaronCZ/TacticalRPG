import { ISkillData } from 'engine/skill/skill-data';
import { EarthMagicSkillID } from 'engine/skill/magic';

const earthMagic: { [id in EarthMagicSkillID]: ISkillData; } = {
	EARTH_MAGIC_BOULDER: {
		title: 'Boulder',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
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
		grade: 1,
		range: 4,
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
		grade: 2,
		range: 4,
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
		grade: 1,
		range: 0,
		area: 'SINGLE',
		target: 'SELF',
		element: 'EARTH',
		status: ['IRON_SKIN']
	}
};

export default earthMagic;
