import { ISkill } from 'models/skill';
import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill/attributes';

const thunderblade: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.THUNDERBLADE_THUNDERSTRIKE, {
		title: 'Thunderstrike',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 0.75,
		elementalDamage: 0.75,
		status: []
	}],
	[JobSkillID.THUNDERBLADE_THUNDREBOLT, {
		title: 'Thunderbolt',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R2,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.THUNDER,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}]
];

export const thunderbladeSkillset: ISkillset = {
	title: 'Thunderblade',
	description: '',
	skills: thunderblade.map(([id, skill]) => id)
};

export default thunderblade;
