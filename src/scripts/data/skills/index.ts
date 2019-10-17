import DataList from 'core/data-list';

import miscSkills from 'data/skills/misc';
import armorSkills from 'data/skills/armor';
import magicSkills from 'data/skills/magic';
import weaponSkills from 'data/skills/weapon';
import dynamicSkills from 'data/skills/dynamic';

import { SkillID, ISkillData } from 'modules/skill/skill-data';

export const attackSkills: SkillID[] = [
	'FST_ATTACK', 'DGR_ATTACK',
	'S1H_ATTACK', 'A1H_ATTACK', 'M1H_ATTACK',
	'SPR_ATTACK', 'S2H_ATTACK', 'A2H_ATTACK', 'M2H_ATTACK',
	'BOW_ATTACK', 'GUN_ATTACK', 'GUN_ATTACK'
];

const Skills = new DataList<SkillID, ISkillData>({
	...weaponSkills,
	...magicSkills,
	...armorSkills,
	...dynamicSkills,
	...miscSkills
});

export default Skills;
