import { ISkillset } from 'modules/skillset';
import { JobSkillID, IWaterBladeJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const waterblade: IWaterBladeJobSkillList = {
	[JobSkillID.WATERBLADE_WATERSTRIKE]: {
		title: 'Waterstrike',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.WATER,
		physicalDamage: 0.75,
		elementalDamage: 0.75,
		status: []
	},
	[JobSkillID.WATERBLADE_SPLASH]: {
		title: 'Splash',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R2,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.WATER,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}
};

export const waterbladeSkillset: ISkillset = {
	title: 'Waterblade',
	description: '',
	skills: Object.keys(waterblade) as JobSkillID[]
};

export default waterblade;
