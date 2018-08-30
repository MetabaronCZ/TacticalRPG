import { smallShieldBlock } from 'data/game-config';

import { WeaponSkillID, IShieldWeaponSkillList } from 'modules/skill/weapon/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const shieldSkills: IShieldWeaponSkillList = {
	[WeaponSkillID.SHIELD_SMALL_BLOCK]: {
		title: `Block (${smallShieldBlock * 100}%)`,
		cost: 1,
		type: SkillType.REACTIVE,
		range: SkillRange.R0,
		area: SkillArea.SINGLE,
		target: SkillTarget.SELF,
		element: SkillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	},
	[WeaponSkillID.SHIELD_LARGE_BLOCK]: {
		title: 'Block',
		cost: 2,
		type: SkillType.REACTIVE,
		range: SkillRange.R0,
		area: SkillArea.SINGLE,
		target: SkillTarget.SELF,
		element: SkillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}
};

export default shieldSkills;
