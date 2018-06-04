import { ISkill } from 'modules/skill';
import { ISkillset } from 'modules/skillset';
import { JobSkillID } from 'modules/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const flameblade: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.FLAMEBLADE_FLAMESTRIKE, {
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
	}],
	[JobSkillID.FLAMEBLADE_FIREBALL, {
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
	}]
];

export const flamebladeSkillset: ISkillset = {
	title: 'Flameblade',
	description: '',
	skills: flameblade.map(([id, skill]) => id)
};

export default flameblade;
