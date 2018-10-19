import DataList from 'core/data-list';

import weaponSkills from 'data/skills/weapon';
import magicSkills from 'data/skills/magic';
import archetypeSkills from 'data/skills/archetype';

import { SkillID, ISkillData } from 'modules/skill/skill-data';

export const attackSkills: SkillID[] = [
	'FISTS_ATTACK', 'DAGGER_ATTACK',
	'SWORD_1H_ATTACK', 'AXE_1H_ATTACK', 'HAMMER_1H_ATTACK',
	'SPEAR_ATTACK',	'SWORD_2H_ATTACK', 'AXE_2H_ATTACK', 'HAMMER_2H_ATTACK',
	'MACE_ATTACK', 'STAFF_ATTACK',
	'BOW_ATTACK', 'GUN_1H_ATTACK', 'GUN_2H_ATTACK'
];

const Skills = new DataList<SkillID, ISkillData>({
	...weaponSkills,
	...magicSkills,
	...archetypeSkills
});

export default Skills;
