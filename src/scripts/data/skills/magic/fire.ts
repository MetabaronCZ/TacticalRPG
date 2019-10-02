import { ISkillData } from 'modules/skill/skill-data';
import { FireMagicSkillID } from 'modules/skill/magic';

const fireMagic: { [id in FireMagicSkillID]: ISkillData; } = {
	FIR_FIREBALL: {
		title: 'Fireball',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'FIRE',
		physical: 0,
		magical: 1,
		animation: {
			duration: 1000
		}
	},
	FIR_BURN: {
		title: 'Burn',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'FIRE',
		physical: 0,
		magical: 0.5,
		cooldown: 1,
		status: ['BURN'],
		animation: {
			duration: 1000
		}
	},
	FIR_FIRESTORM: {
		title: 'Firestorm',
		mpCost: 20,
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'FIRE',
		physical: 0,
		magical: 0.5,
		cooldown: 2,
		animation: {
			duration: 1000
		}
	}
};

export default fireMagic;
