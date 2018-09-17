import DataList from 'core/data-list';

import { ISkillData } from 'engine/skill';
import { MagicSkillID } from 'engine/skill/magic/types';

import psychokinesis from 'engine/skill/magic/psychokinesis';
import whiteMagic from 'engine/skill/magic/white';
import blackMagic from 'engine/skill/magic/black';
import fireMagic from 'engine/skill/magic/fire';
import waterMagic from 'engine/skill/magic/water';
import windMagic from 'engine/skill/magic/wind';
import earthMagic from 'engine/skill/magic/earth';
import iceMagic from 'engine/skill/magic/ice';
import thunderMagic from 'engine/skill/magic/thunder';

class MagicSkillList extends DataList<MagicSkillID, ISkillData> {}

const MagicSkills = new MagicSkillList({
	NONE: {
		title: 'Magic Skill',
		cost: 0,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE'
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
