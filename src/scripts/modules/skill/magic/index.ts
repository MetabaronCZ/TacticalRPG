import DataList from 'core/data-list';

import psychokinesis from 'modules/skill/magic/psychokinesis';
import whiteMagic from 'modules/skill/magic/white';
import blackMagic from 'modules/skill/magic/black';
import fireMagic from 'modules/skill/magic/fire';
import waterMagic from 'modules/skill/magic/water';
import windMagic from 'modules/skill/magic/wind';
import earthMagic from 'modules/skill/magic/earth';
import iceMagic from 'modules/skill/magic/ice';
import thunderMagic from 'modules/skill/magic/thunder';

import { ISkill } from 'modules/skill/types';
import { MagicSkillID } from 'modules/skill/magic/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

class MagicSkillList extends DataList<MagicSkillID, ISkill> {}

const MagicSkills = new MagicSkillList({
	[MagicSkillID.NONE]: {
		title: 'Magic Skill',
		cost: 0,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.NONE,
		element: SkillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	},
	...psychokinesis,
	...whiteMagic,
	...blackMagic,
	...fireMagic,
	...waterMagic,
	...windMagic,
	...earthMagic,
	...iceMagic,
	...thunderMagic
});

export default MagicSkills;