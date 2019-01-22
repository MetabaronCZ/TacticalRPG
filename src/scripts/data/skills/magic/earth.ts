import { ISkillData } from 'modules/skill/skill-data';
import { EarthMagicSkillID } from 'modules/skill/magic';

const earthMagic: { [id in EarthMagicSkillID]: ISkillData; } = {
	ERT_BOULDER: {
		title: 'Boulder',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'EARTH',
		physicalDamage: 0.5,
		magicalDamage: 1
	},
	ERT_EARTH_SPIKE: {
		title: 'Earth Spike',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'EARTH',
		physicalDamage: 0.25,
		magicalDamage: 0.25,
		status: ['STUN'],
		cooldown: 1
	},
	ERT_EARTHQUAKE: {
		title: 'Earthquake',
		cost: 4,
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'EARTH',
		physicalDamage: 0.25,
		magicalDamage: 5,
		status: [],
		cooldown: 2
	},
	ERT_STONE_SKIN: {
		title: 'Stone Skin',
		cost: 0,
		type: 'PASSIVE',
		grade: 1,
		range: 0,
		area: 'SINGLE',
		target: 'SELF',
		element: 'EARTH',
		status: ['IRON_SKIN'],
		cooldown: 1
	}
};

export default earthMagic;
