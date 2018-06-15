import { ISkillset } from 'modules/skillset';
import { JobSkillID, IStoneBladeJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const stoneblade: IStoneBladeJobSkillList = {
	[JobSkillID.STONEBLADE_EARTHSTRIKE]: {
		title: 'Earthstrike',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.EARTH,
		physicalDamage: 0.75,
		elementalDamage: 0.75,
		status: []
	},
	[JobSkillID.STONEBLADE_BOULDER]: {
		title: 'Boulder',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R2,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.EARTH,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}
};

export const stonebladeSkillset: ISkillset = {
	title: 'Stoneblade',
	description: '',
	skills: Object.keys(stoneblade) as JobSkillID[]
};

export default stoneblade;
