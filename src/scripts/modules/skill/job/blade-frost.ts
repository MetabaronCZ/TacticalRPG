import { ISkillset } from 'modules/skillset';
import { JobSkillID, IFrostBladeJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const frostblade: IFrostBladeJobSkillList = {
	[JobSkillID.FROSTBLADE_FROSTSTRIKE]: {
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
	},
	[JobSkillID.FROSTBLADE_FROSTSPEAR]: {
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
	}
};

export const frostbladeSkillset: ISkillset = {
	title: 'Frostblade',
	description: '',
	skills: Object.keys(frostblade) as JobSkillID[]
};

export default frostblade;
