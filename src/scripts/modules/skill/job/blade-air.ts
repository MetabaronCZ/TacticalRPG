import { ISkill } from 'modules/skill';
import { ISkillset } from 'modules/skillset';
import { JobSkillID } from 'modules/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const airblade: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.AIRBLADE_WINDSTRIKE, {
		title: 'Windstrike',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.WIND,
		physicalDamage: 0.75,
		elementalDamage: 0.75,
		status: []
	}],
	[JobSkillID.AIRBLADE_AIR_BLAST, {
		title: 'Air Blast',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R2,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.WIND,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}]
];

export const airbladeSkillset: ISkillset = {
	title: 'Airblade',
	description: '',
	skills: airblade.map(([id, skill]) => id)
};

export default airblade;
