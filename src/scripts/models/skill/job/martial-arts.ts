import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const martialArts: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.MARTIAL_ARTS_NONE, {
		title: 'Martial Arts',
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

export const martialArtsSkillset: ISkillset = {
	title: 'Martial Arts',
	description: '',
	skills: martialArts.map(([id, skill]) => id)
};

export default martialArts;
