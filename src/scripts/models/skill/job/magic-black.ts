import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { ISkill, SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill';

const blackMagic: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.BLACK_MAGIC_DARK_AURA, {
		title: 'Dark Aura',
		cost: 0,
		type: SkillType.PASSIVE,
		range: SkillRange.R0,
		area: SkillArea.AOE3x3,
		target: SkillTarget.SELF,
		isAreaEffect: true,
		element: SkillElement.DARK,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}]
];

export const blackMagicSkillset: ISkillset = {
	title: 'Black Magic',
	description: '',
	skills: blackMagic.map(([id, skill]) => id)
};

export default blackMagic;
