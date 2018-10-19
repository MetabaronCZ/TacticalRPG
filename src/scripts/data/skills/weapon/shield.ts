import { smallShieldBlock } from 'data/game-config';

import { ISkillData } from 'modules/skill/skill-data';
import { ShieldWeaponSkillID } from 'modules/skill/weapon';

const shieldSkills: { [id in ShieldWeaponSkillID]: ISkillData; } = {
	SHIELD_SMALL_BLOCK: {
		title: `Block (${smallShieldBlock * 100}%)`,
		cost: 1,
		type: 'REACTIVE',
		range: 0,
		area: 'SINGLE',
		target: 'SELF'
	},
	SHIELD_LARGE_BLOCK: {
		title: 'Block',
		cost: 2,
		type: 'REACTIVE',
		range: 0,
		area: 'SINGLE',
		target: 'SELF'
	}
};

export default shieldSkills;
