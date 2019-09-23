import { ISkillData } from 'modules/skill/skill-data';
import { ShieldWeaponSkillID } from 'modules/skill/weapon';

const shieldSkills: { [id in ShieldWeaponSkillID]: ISkillData; } = {
	SHD_SMALL_BLOCK: {
		title: 'Block',
		apCost: 1,
		type: 'REACTIVE',
		range: 0,
		area: 'SINGLE',
		target: 'SELF',
		weapon: 'SHIELD_SMALL',
		physical: 1,
		magical: 1,
		block: 1,
		status: ['BLOCK_SMALL'],
		animation: {
			duration: 150
		}
	},
	SHD_LARGE_BLOCK: {
		title: 'Block',
		apCost: 2,
		type: 'REACTIVE',
		range: 0,
		area: 'SINGLE',
		target: 'SELF',
		weapon: 'SHIELD_LARGE',
		physical: 1,
		magical: 1,
		block: 1,
		status: ['BLOCK_LARGE'],
		animation: {
			duration: 150
		}
	}
};

export default shieldSkills;
