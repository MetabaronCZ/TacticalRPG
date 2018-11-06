import { ISkillData } from 'modules/skill/skill-data';
import { PsychokinesisSkillID } from 'modules/skill/magic';

const psychokinesis: { [id in PsychokinesisSkillID]: ISkillData; } = {
	PSYCHOKINESIS_KINETIC_STRIKE: {
		title: 'Kinetic Strike',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'PSYCHIC',
		physicalDamage: 0.5,
		elementalDamage: 1
	},
	PSYCHOKINESIS_CONFUSION: {
		title: 'Confusion',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'PSYCHIC',
		status: ['CONFUSION'],
		cooldown: 1
	},
	PSYCHOKINESIS_PSYCHODOME: {
		title: 'Psychodome',
		cost: 0,
		type: 'PASSIVE',
		grade: 1,
		range: 0,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'PSYCHIC'
	}
};

export default psychokinesis;
