import { ISkillData } from 'modules/skill/skill-data';
import { WindMagicSkillID } from 'modules/skill/magic';

const windMagic: { [id in WindMagicSkillID]: ISkillData; } = {
	WND_AIR_BLAST: {
		title: 'Air Blast',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'WIND',
		physical: 0,
		magical: 1,
		animation: {
			duration: 1000
		}
	},
	WND_JET_STREAM: {
		title: 'Jet Stream',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'WIND',
		physical: 0,
		magical: 0.5,
		cooldown: 1,
		animation: {
			duration: 1000
		}
	},
	WND_TORNADO: {
		title: 'Tornado',
		mpCost: 20,
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'WIND',
		physical: 0,
		magical: 0.5,
		cooldown: 2,
		animation: {
			duration: 1000
		}
	},
	WND_WIND_AURA: {
		title: 'Wind Aura',
		mpCost: 0,
		type: 'PASSIVE',
		grade: 1,
		range: 0,
		area: 'AOE3x3',
		target: 'SELF',
		element: 'WIND',
		physical: 0,
		magical: 0.25,
		animation: {
			duration: 0
		}
	}
};

export default windMagic;
