import iceMagic from 'data/skills/magic/ice';
import holyMagic from 'data/skills/magic/holy';
import darkMagic from 'data/skills/magic/dark';
import fireMagic from 'data/skills/magic/fire';
import windMagic from 'data/skills/magic/wind';
import earthMagic from 'data/skills/magic/earth';
import waterMagic from 'data/skills/magic/water';
import thunderMagic from 'data/skills/magic/thunder';
import psychokinesis from 'data/skills/magic/psychokinesis';

import { ISkillData } from 'modules/skill/skill-data';
import { MagicSkillID } from 'modules/skill/magic';

const magicSkills: { [id in MagicSkillID]: ISkillData; } = {
	...psychokinesis,
	...holyMagic,
	...darkMagic,
	...fireMagic,
	...waterMagic,
	...windMagic,
	...earthMagic,
	...iceMagic,
	...thunderMagic
};

export default magicSkills;
