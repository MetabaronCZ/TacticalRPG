import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement, SkillStatus } from 'models/skill';

const illusion: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.ILLUSION_NONE, {
		title: 'Invisibility',
		cost: 0,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}]
];

export const illusionSkillset: ISkillset = {
	title: 'Illusion',
	description: '',
	skills: illusion.map(([id, skill]) => id)
};

export default illusion;
