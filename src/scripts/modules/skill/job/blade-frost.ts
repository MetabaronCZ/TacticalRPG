import { ISkill } from 'modules/skill';
import { ISkillset } from 'modules/skillset';
import { JobSkillID } from 'modules/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const frostblade: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.FROSTBLADE_FROSTSTRIKE, {
		title: 'Froststrike',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.ICE,
		physicalDamage: 0.75,
		elementalDamage: 0.75,
		status: []
	}],
	[JobSkillID.FROSTBLADE_FROSTSPEAR, {
		title: 'Frostspear',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R2,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.ICE,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}]
];

export const frostbladeSkillset: ISkillset = {
	title: 'Frostblade',
	description: '',
	skills: frostblade.map(([id, skill]) => id)
};

export default frostblade;
