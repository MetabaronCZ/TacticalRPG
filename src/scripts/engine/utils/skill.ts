import { attackSkills } from 'data/skills';

import Skill from 'engine/skill';
import { SkillID } from 'engine/skill/skill-data';

const isAttackSkill = (id: SkillID): boolean => -1 !== attackSkills.indexOf(id);

export const filterAttackSkills = (ids: SkillID[]): Skill[] => {
	const skills: Skill[] = [];

	for (const id of ids) {
		const skill = new Skill(id);

		if ('ACTIVE' === skill.type && isAttackSkill(id)) {
			skills.push(skill);
		}
	}
	return skills;
};

export const filterSpecialSkills = (ids: SkillID[]): Skill[] => {
	const skills: Skill[] = [];
	const uniqueSkills: SkillID[] = [];

	for (const id of ids) {
		const skill = new Skill(id);

		if ('ACTIVE' === skill.type && !isAttackSkill(id) && -1 === uniqueSkills.indexOf(id)) {
			uniqueSkills.push(id);
			skills.push(skill);
		}
	}
	return skills;
};
