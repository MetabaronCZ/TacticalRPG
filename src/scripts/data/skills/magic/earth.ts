import { ISkillData } from 'modules/skill/skill-data';
import { EarthMagicSkillID } from 'modules/skill/magic';

const earthMagic: { [id in EarthMagicSkillID]: ISkillData; } = {
	ERT_BOULDER: {
		title: 'Boulder',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'EARTH',
		physical: 0,
		magical: 1,
		animation: {
			duration: 1000
		}
	},
	ERT_EARTH_SPIKE: {
		title: 'Earth Spike',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'EARTH',
		physical: 0,
		magical: 0.5,
		cooldown: 1,
		status: ['STUN'],
		animation: {
			duration: 1000
		}
	},
	ERT_EARTHQUAKE: {
		title: 'Earthquake',
		mpCost: 20,
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'EARTH',
		physical: 0,
		magical: 0.5,
		status: [],
		cooldown: 2,
		animation: {
			duration: 1000
		}
	},
	ERT_STONE_SKIN: {
		title: 'Stone Skin',
		mpCost: 0,
		type: 'PASSIVE',
		grade: 1,
		range: 0,
		area: 'SINGLE',
		target: 'SELF',
		element: 'EARTH',
		status: ['IRON_SKIN'],
		physical: 0,
		magical: 0,
		cooldown: 1,
		animation: {
			duration: 1000
		}
	}
};

export default earthMagic;
