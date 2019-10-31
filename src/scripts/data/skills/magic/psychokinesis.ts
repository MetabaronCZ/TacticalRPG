import { ISkillData } from 'modules/skill/skill-data';
import { PsychokinesisSkillID } from 'modules/skill/magic';

const psychokinesis: { [id in PsychokinesisSkillID]: ISkillData; } = {
	PSY_MINDBLAST: {
		title: 'Mindblast',
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
			element: 'KINETIC'
		},
		animation: {
			duration: 1000
		}
	},
	PSY_CONFUSION: {
		title: 'Confusion',
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		status: ['CONFUSION'],
		cooldown: 1,
		cost: {
			MP: 10
		},
		magical: {
			modifier: 0,
			element: 'KINETIC'
		},
		animation: {
			duration: 1000
		}
	}
};

export default psychokinesis;
