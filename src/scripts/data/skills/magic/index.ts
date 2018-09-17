import psychokinesis from 'data/skills/magic/psychokinesis';
import whiteMagic from 'data/skills/magic/white';
import blackMagic from 'data/skills/magic/black';
import fireMagic from 'data/skills/magic/fire';
import waterMagic from 'data/skills/magic/water';
import windMagic from 'data/skills/magic/wind';
import earthMagic from 'data/skills/magic/earth';
import iceMagic from 'data/skills/magic/ice';
import thunderMagic from 'data/skills/magic/thunder';

import { ISkillData } from 'engine/skill/skill-data';
import { MagicSkillID } from 'engine/skill/magic';

const magicSkills: { [id in MagicSkillID]: ISkillData; } = {
	...psychokinesis,
	...whiteMagic,
	...blackMagic,
	...fireMagic,
	...waterMagic,
	...windMagic,
	...earthMagic,
	...iceMagic,
	...thunderMagic
};

export default magicSkills;
