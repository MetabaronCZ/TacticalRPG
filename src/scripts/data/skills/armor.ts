import { ISkillData } from 'modules/skill/skill-data';
import { ArmorSkillID } from 'modules/skill/armor';

const armorSkills: { [id in ArmorSkillID]: ISkillData; } = {
	EVADE: {
		title: 'Evade',
		type: 'REACTIVE',
		range: 1,
		area: 'SINGLE',
		cost: {
			AP: 4
		},
		animation: {
			duration: 150
		}
	},
	ENERGY_SHIELD: {
		title: 'Energy Shield',
		type: 'REACTIVE',
		range: 0,
		area: 'SINGLE',
		target: 'SELF',
		status: ['ENERGY_SHIELD'],
		cost: {},
		animation: {
			duration: 150
		}
	}
};

export default armorSkills;
