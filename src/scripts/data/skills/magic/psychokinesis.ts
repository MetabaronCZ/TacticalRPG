import { ISkillData } from 'modules/skill/skill-data';
import { PsychokinesisSkillID } from 'modules/skill/magic';

const psychokinesis: { [id in PsychokinesisSkillID]: ISkillData; } = {
	PSY_MINDBLAST: {
		title: 'Mindblast',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'PSYCHIC',
		physical: 0,
		magical: 1,
		animation: {
			duration: 1000
		}
	},
	PSY_CONFUSION: {
		title: 'Confusion',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'PSYCHIC',
		status: ['CONFUSION'],
		physical: 0,
		magical: 0,
		cooldown: 1,
		animation: {
			duration: 1000
		}
	}
};

export default psychokinesis;
