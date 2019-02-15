import { ISkillData } from 'modules/skill/skill-data';
import { ShieldWeaponSkillID } from 'modules/skill/weapon';

const shieldSkills: { [id in ShieldWeaponSkillID]: ISkillData; } = {
	SHD_SMALL_BLOCK: {
		title: 'Block',
		cost: 1,
		type: 'REACTIVE',
		range: 0,
		area: 'SINGLE',
		target: 'SELF',
		physical: 10,
		magical: 10
	},
	SHD_LARGE_BLOCK: {
		title: 'Block',
		cost: 2,
		type: 'REACTIVE',
		range: 0,
		area: 'SINGLE',
		target: 'SELF',
		physical: 20,
		magical: 20
	}
};

export default shieldSkills;
