import { ISkillData } from 'modules/skill/skill-data';
import { FireMagicSkillID } from 'modules/skill/magic';

const fireMagic: { [id in FireMagicSkillID]: ISkillData; } = {
	FIR_FIREBALL: {
		title: 'Fireball',
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
			element: 'FIRE'
		},
		animation: {
			duration: 1000
		}
	},
	FIR_BURN: {
		title: 'Burn',
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		status: ['BURN'],
		cooldown: 1,
		cost: {
			MP: 10
		},
		magical: {
			modifier: 0.5,
			element: 'FIRE'
		},
		animation: {
			duration: 1000
		}
	},
	FIR_FIRESTORM: {
		title: 'Firestorm',
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
			element: 'FIRE'
		},
		animation: {
			duration: 1000
		}
	}
};

export default fireMagic;
