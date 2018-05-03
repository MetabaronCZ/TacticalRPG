import { ISkill } from 'models/skill';
import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill/attributes';

const stoneblade: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.STONEBLADE_EARTHSTRIKE, {
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
	}],
	[JobSkillID.STONEBLADE_BOULDER, {
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
	}]
];

export const stonebladeSkillset: ISkillset = {
	title: 'Stoneblade',
	description: '',
	skills: stoneblade.map(([id, skill]) => id)
};

export default stoneblade;
