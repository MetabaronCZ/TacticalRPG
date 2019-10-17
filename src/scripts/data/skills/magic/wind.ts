import { ISkillData } from 'modules/skill/skill-data';
import { WindMagicSkillID } from 'modules/skill/magic';

const windMagic: { [id in WindMagicSkillID]: ISkillData; } = {
	WND_AIR_BLAST: {
		title: 'Air Blast',
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		cost: {
			MP: 10
		},
		magical: {
			modifier: 1,
			element: 'WIND'
		},
		animation: {
			duration: 1000
		}
	},
	WND_JET_STREAM: {
		title: 'Jet Stream',
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		cooldown: 1,
		cost: {
			MP: 10
		},
		magical: {
			modifier: 0.5,
			element: 'WIND'
		},
		animation: {
			duration: 1000
		}
	},
	WND_TORNADO: {
		title: 'Tornado',
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		cooldown: 2,
		cost: {
			MP: 20
		},
		magical: {
			modifier: 0.5,
			element: 'WIND'
		},
		animation: {
			duration: 1000
		}
	}
};

export default windMagic;
