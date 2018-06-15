import { ISkillset } from 'modules/skillset';
import { JobSkillID, IFlameBladeJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const flameblade: IFlameBladeJobSkillList = {
	[JobSkillID.FLAMEBLADE_FLAMESTRIKE]: {
		title: 'Flamestrike',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R2,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.FIRE,
		physicalDamage: 0.75,
		elementalDamage: 0.75,
		status: []
	},
	[JobSkillID.FLAMEBLADE_FIREBALL]: {
		title: 'Fireball',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R2,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.FIRE,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}
};

export const flamebladeSkillset: ISkillset = {
	title: 'Flameblade',
	description: '',
	skills: Object.keys(flameblade) as JobSkillID[]
};

export default flameblade;
