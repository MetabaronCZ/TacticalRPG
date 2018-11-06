import DataList from 'core/data-list';

import weaponSkills from 'data/skills/weapon';
import magicSkills from 'data/skills/magic';
import archetypeSkills from 'data/skills/archetype';

import { SkillID, ISkillData } from 'modules/skill/skill-data';

export const attackSkills: SkillID[] = [
	'FST_ATTACK', 'DGR_ATTACK',
	'S1H_ATTACK', 'A1H_ATTACK', 'H1H_ATTACK',
	'SPR_ATTACK', 'S2H_ATTACK', 'A2H_ATTACK', 'H2H_ATTACK',
	'MCE_ATTACK', 'STF_ATTACK',
	'BOW_ATTACK', 'G1H_ATTACK', 'G2H_ATTACK'
];

const Skills = new DataList<SkillID, ISkillData>({
	...weaponSkills,
	...magicSkills,
	...archetypeSkills
});

export default Skills;
