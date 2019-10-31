import { ISkillData } from 'modules/skill/skill-data';
import { MagicalWeaponSkillID } from 'modules/skill/weapon';

const magicalSkills: { [id in MagicalWeaponSkillID]: ISkillData; } = {
	ATB_ATTACK: {
		title: 'Attack',
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		cost: {
			AP: 1,
			MP: 5
		},
		physical: {
			modifier: 1,
			weapon: 'AETHERBLADE'
		},
		magical: {
			modifier: 1,
			element: 'KINETIC'
		},
		animation: {
			duration: 1000
		}
	}
};

export default magicalSkills;
