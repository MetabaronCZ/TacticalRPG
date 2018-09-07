import { smallShieldBlock } from 'data/game-config';

import { SkillRange } from 'engine/skill';
import { IShieldWeaponSkillList } from 'engine/skill/weapon/types';

const shieldSkills: IShieldWeaponSkillList = {
	SHIELD_SMALL_BLOCK: {
		title: `Block (${smallShieldBlock * 100}%)`,
		cost: 1,
		type: 'REACTIVE',
		range: SkillRange.R0,
		area: 'SINGLE',
		target: 'SELF'
	},
	SHIELD_LARGE_BLOCK: {
		title: 'Block',
		cost: 2,
		type: 'REACTIVE',
		range: SkillRange.R0,
		area: 'SINGLE',
		target: 'SELF'
	}
};

export default shieldSkills;