import { ISkill } from 'models/skill';
import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill/attributes';

const waterblade: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.WATERBLADE_WATERSTRIKE, {
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
	}],
	[JobSkillID.WATERBLADE_SPLASH, {
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
	}]
];

export const waterbladeSkillset: ISkillset = {
	title: 'Waterblade',
	description: '',
	skills: waterblade.map(([id, skill]) => id)
};

export default waterblade;
