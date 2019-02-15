import { ISkillData } from 'modules/skill/skill-data';
import { PsychokinesisSkillID } from 'modules/skill/magic';

const psychokinesis: { [id in PsychokinesisSkillID]: ISkillData; } = {
	PSY_KINETIC_STRIKE: {
		title: 'Kinetic Strike',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'PSYCHIC',
		physical: 0,
		magical: 1
	},
	PSY_CONFUSION: {
		title: 'Confusion',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'PSYCHIC',
		status: ['CONFUSION'],
		physical: 0,
		magical: 0,
		cooldown: 1
	},
	PSY_PSYCHODOME: {
		title: 'Psychodome',
		cost: 0,
		type: 'PASSIVE',
		grade: 1,
		range: 0,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'PSYCHIC',
		physical: 0,
		magical: 0,
		status: ['CONFUSION']
	}
};

export default psychokinesis;
