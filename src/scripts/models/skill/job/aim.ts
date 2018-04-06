import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const aim: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.AIM_NONE, {
		title: 'Aim',
		cost: 0,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}],
];

export const aimSkillset: ISkillset = {
	title: 'Aim',
	description: '',
	skills: aim.map(([id, skill]) => id)
};

export default aim;
