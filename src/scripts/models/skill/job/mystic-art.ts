import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { ISkill, SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill';

const mysticArt: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.MYSTIC_ART_NONE, {
		title: 'Mystic Arts',
		cost: 0,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.NONE,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}]
];

export const mysticArtSkillset: ISkillset = {
	title: 'Mystic Arts',
	description: '',
	skills: mysticArt.map(([id, skill]) => id)
};

export default mysticArt;
