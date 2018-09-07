import { IPsychokinesisSkillList, MagicSkillID } from 'engine/skill/magic/types';
import { ISkillset } from 'engine/skillset';
import { SkillRange } from 'engine/skill';

const psychokinesis: IPsychokinesisSkillList = {
	PSYCHOKINESIS_KINETIC_STRIKE: {
		title: 'Kinetic Strike',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R4,
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
		range: SkillRange.R4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'PSYCHIC',
		status: ['FORGET']
	},
	PSYCHOKINESIS_PSYCHODOME: {
		title: 'Psychodome',
		cost: 0,
		type: 'PASSIVE',
		range: SkillRange.R0,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'PSYCHIC'
	}
};

export const psychokinesisSkillset: ISkillset = {
	title: 'Psychokinesis',
	description: '',
	element: 'PSYCHIC',
	skills: Object.keys(psychokinesis) as MagicSkillID[]
};

export default psychokinesis;
