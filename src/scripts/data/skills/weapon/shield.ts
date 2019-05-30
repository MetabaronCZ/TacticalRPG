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
		physical: 1,
		magical: 1,
		block: 1
	},
	SHD_LARGE_BLOCK: {
		title: 'Block',
		apCost: 2,
		type: 'REACTIVE',
		range: 0,
		area: 'SINGLE',
		target: 'SELF',
		physical: 1,
		magical: 1,
		block: 1
	}
};

export default shieldSkills;
