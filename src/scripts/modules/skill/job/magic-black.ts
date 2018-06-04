import { ISkill } from 'modules/skill';
import { ISkillset } from 'modules/skillset';
import { JobSkillID } from 'modules/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

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
