import { ISkillset } from 'modules/skillset';
import { JobSkillID, IThunderBladeJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const thunderblade: IThunderBladeJobSkillList = {
	[JobSkillID.THUNDERBLADE_THUNDERSTRIKE]: {
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
	},
	[JobSkillID.THUNDERBLADE_THUNDREBOLT]: {
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
	}
};

export const thunderbladeSkillset: ISkillset = {
	title: 'Thunderblade',
	description: '',
	skills: Object.keys(thunderblade) as JobSkillID[]
};

export default thunderblade;
