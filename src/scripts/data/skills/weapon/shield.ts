import { ISkillData } from 'modules/skill/skill-data';
import { ShieldWeaponSkillID } from 'modules/skill/weapon';

const shieldSkills: { [id in ShieldWeaponSkillID]: ISkillData; } = {
	SHD_SMALL_BLOCK: {
		title: 'Block',
		type: 'REACTIVE',
		range: 0,
		area: 'SINGLE',
		target: 'SELF',
		status: ['BLOCK_SMALL'],
		cost: {
			AP: 1
		},
		block: {
			modifier: 1,
			weapon: 'SHIELD_SMALL'
		},
		animation: {
			duration: 150
		}
	},
	SHD_LARGE_BLOCK: {
		title: 'Block',
		type: 'REACTIVE',
		range: 0,
		area: 'SINGLE',
		target: 'SELF',
		status: ['BLOCK_LARGE'],
		cost: {
			AP: 2
		},
		block: {
			modifier: 1,
			weapon: 'SHIELD_LARGE'
		},
		animation: {
			duration: 150
		}
	}
};

export default shieldSkills;
