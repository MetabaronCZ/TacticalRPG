import { ISkillData } from 'modules/skill/skill-data';
import { ThunderMagicSkillID } from 'modules/skill/magic';

const thunderMagic: { [id in ThunderMagicSkillID]: ISkillData; } = {
	THU_THUNDERBOLT: {
		title: 'Thunderbolt',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'THUNDER',
		physical: 0,
		magical: 1
	},
	THU_SHOCK: {
		title: 'Shock',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'THUNDER',
		physical: 0,
		magical: 0.5,
		status: ['SHOCK'],
		cooldown: 1
	},
	THU_THUNDERSTORM: {
		title: 'Thunderstorm',
		cost: 4,
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'THUNDER',
		physical: 0,
		magical: 0.5,
		cooldown: 2
	},
	THU_THUNDER_AURA: {
		title: 'Thunder Aura',
		cost: 0,
		type: 'PASSIVE',
		grade: 1,
		range: 0,
		area: 'AOE3x3',
		target: 'SELF',
		element: 'THUNDER',
		physical: 0,
		magical: 0.25,
		status: ['SHOCK']
	}
};

export default thunderMagic;
