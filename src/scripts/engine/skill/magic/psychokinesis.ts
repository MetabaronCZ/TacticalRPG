import { IPsychokinesisSkillList } from 'engine/skill/magic/types';

const psychokinesis: IPsychokinesisSkillList = {
	PSYCHOKINESIS_KINETIC_STRIKE: {
		title: 'Kinetic Strike',
		cost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'PSYCHIC',
		physicalDamage: 0.5,
		elementalDamage: 1
	},
	PSYCHOKINESIS_FORGET: {
		title: 'Forget',
		cost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'PSYCHIC',
		status: ['FORGET']
	},
	PSYCHOKINESIS_PSYCHODOME: {
		title: 'Psychodome',
		cost: 0,
		type: 'PASSIVE',
		range: 0,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'PSYCHIC'
	}
};

export default psychokinesis;
